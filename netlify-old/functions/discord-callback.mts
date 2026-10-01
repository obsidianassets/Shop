import type { Context } from '@netlify/functions'
import { callbackUrl, expiresIn, secureCookie, SESSION_COOKIE, SESSION_TTL, sign, siteUrl, STATE_COOKIE, verify } from './_discord-auth.mts'

function redirectWithError(code: string) {
  const destination = new URL(siteUrl())
  destination.searchParams.set('discord_error', code)
  return Response.redirect(destination, 302)
}

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'access_denied') return redirectWithError('cancelled')

    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const savedState = verify(context.cookies.get(STATE_COOKIE))
    context.cookies.delete(STATE_COOKIE)
    if (!code || !state || savedState?.state !== state) return redirectWithError('cancelled')

    const clientId = Netlify.env.get('DISCORD_CLIENT_ID')
    const clientSecret = Netlify.env.get('DISCORD_CLIENT_SECRET')
    const guildId = Netlify.env.get('DISCORD_GUILD_ID')
    const clientRoleId = Netlify.env.get('DISCORD_CLIENT_ROLE_ID')
    if (!clientId || !clientSecret || !guildId || !clientRoleId) throw new Error('Discord OAuth is not configured')

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl(),
      }),
    })
    if (!tokenResponse.ok) return redirectWithError('cancelled')
    const token = await tokenResponse.json() as { access_token?: string; token_type?: string }
    if (!token.access_token) return redirectWithError('cancelled')

    const authorization = `${token.token_type || 'Bearer'} ${token.access_token}`
    const [userResponse, memberResponse] = await Promise.all([
      fetch('https://discord.com/api/users/@me', { headers: { Authorization: authorization } }),
      fetch(`https://discord.com/api/users/@me/guilds/${encodeURIComponent(guildId)}/member`, { headers: { Authorization: authorization } }),
    ])

    if (memberResponse.status === 404) return redirectWithError('not_in_server')
    if (!userResponse.ok || !memberResponse.ok) return redirectWithError('login_failed')

    const user = await userResponse.json() as { id?: string; username?: string }
    const member = await memberResponse.json() as { roles?: string[] }
    if (!Array.isArray(member.roles) || !member.roles.includes(clientRoleId)) {
      return redirectWithError('missing_role')
    }
    if (!user.id) return redirectWithError('login_failed')

    context.cookies.set({
      ...secureCookie,
      name: SESSION_COOKIE,
      value: sign({ sub: user.id, username: user.username, exp: expiresIn(SESSION_TTL) }),
    })
    return Response.redirect(siteUrl(), 302)
  } catch {
    return redirectWithError('login_failed')
  }
}
