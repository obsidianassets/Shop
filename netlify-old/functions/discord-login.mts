import type { Context } from '@netlify/functions'
import { callbackUrl, expiresIn, nonce, secureCookie, sign, STATE_COOKIE, STATE_MAX_AGE } from './_discord-auth.mts'

export default async (_request: Request, context: Context) => {
  const clientId = Netlify.env.get('DISCORD_CLIENT_ID')
  if (!clientId) return new Response('Discord login is not configured.', { status: 500 })

  try {
    const state = nonce()
    context.cookies.set({
      ...secureCookie,
      name: STATE_COOKIE,
      value: sign({ state, exp: expiresIn(STATE_MAX_AGE) }),
      maxAge: STATE_MAX_AGE,
    })

    const authorize = new URL('https://discord.com/oauth2/authorize')
    authorize.searchParams.set('client_id', clientId)
    authorize.searchParams.set('response_type', 'code')
    authorize.searchParams.set('redirect_uri', callbackUrl())
    authorize.searchParams.set('scope', 'identify guilds.members.read')
    authorize.searchParams.set('state', state)
    return Response.redirect(authorize, 302)
  } catch {
    return new Response('Discord login is not configured.', { status: 500 })
  }
}
