import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = 'oa_session'
export const STATE_COOKIE = 'oa_oauth_state'
export const SESSION_TTL = 60 * 60 * 12
export const STATE_MAX_AGE = 60 * 10

type SignedPayload = Record<string, unknown> & { exp: number }

function secret() {
  const value = Netlify.env.get('SESSION_SECRET')
  if (!value) throw new Error('SESSION_SECRET is not configured')
  return value
}

function signature(encoded: string) {
  return createHmac('sha256', secret()).update(encoded).digest('base64url')
}

export function sign(payload: SignedPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${signature(encoded)}`
}

export function verify(value: string | undefined): SignedPayload | null {
  if (!value) return null
  const [encoded, suppliedSignature, extra] = value.split('.')
  if (!encoded || !suppliedSignature || extra) return null

  const expectedSignature = signature(encoded)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SignedPayload
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000)
      ? payload
      : null
  } catch {
    return null
  }
}

export function expiresIn(seconds: number) {
  return Math.floor(Date.now() / 1000) + seconds
}

export function nonce() {
  return randomBytes(24).toString('base64url')
}

export function callbackUrl() {
  const siteUrl = Netlify.env.get('SITE_URL')
  if (!siteUrl) throw new Error('SITE_URL is not configured')
  return `${siteUrl.replace(/\/$/, '')}/.netlify/functions/discord-callback`
}

export function siteUrl() {
  const value = Netlify.env.get('SITE_URL')
  if (!value) throw new Error('SITE_URL is not configured')
  return `${value.replace(/\/$/, '')}/`
}

export const secureCookie = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
}
