import { createHash, timingSafeEqual } from 'node:crypto'

const LOCKED_MODULE_TITLE = 'Common Issues SOP for Obsidian Assets'

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status })
}

function passwordsMatch(submitted: string, expected: string) {
  const submittedDigest = createHash('sha256').update(submitted).digest()
  const expectedDigest = createHash('sha256').update(expected).digest()

  return timingSafeEqual(submittedDigest, expectedDigest)
}

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  }

  const expectedPassword = Netlify.env.get('PLAYBOOK_PASSWORD')
  let body: { password?: unknown; moduleTitle?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: 'Incorrect password. Try again.' }, 401)
  }

  const authorized = typeof body.password === 'string'
    && body.moduleTitle === LOCKED_MODULE_TITLE
    && typeof expectedPassword === 'string'
    && passwordsMatch(body.password, expectedPassword)

  if (!authorized) {
    return json({ ok: false, error: 'Incorrect password. Try again.' }, 401)
  }

  return json({ ok: true }, 200)
}
