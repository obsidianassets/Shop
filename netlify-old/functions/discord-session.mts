import type { Context } from '@netlify/functions'
import { SESSION_COOKIE, verify } from './_discord-auth.mts'

export default async (_request: Request, context: Context) => {
  const session = verify(context.cookies.get(SESSION_COOKIE))
  if (!session) {
    return Response.json({ authenticated: false }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  return Response.json({ authenticated: true }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
