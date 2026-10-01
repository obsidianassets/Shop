import type { Context } from '@netlify/functions'
import { SESSION_COOKIE, siteUrl } from './_discord-auth.mts'

export default async (_request: Request, context: Context) => {
  context.cookies.delete(SESSION_COOKIE)
  try {
    return Response.redirect(siteUrl(), 302)
  } catch {
    return new Response(null, { status: 204 })
  }
}
