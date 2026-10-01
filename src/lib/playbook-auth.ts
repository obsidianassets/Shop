import { createHmac, timingSafeEqual } from "crypto";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

export function sign(payload: object) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verify(token?: string | null) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = createHmac("sha256", secret()).update(data).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(data, "base64url").toString());
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload as { sub: string; username: string; exp: number };
}

export function siteUrl() {
  return process.env.SITE_URL || "https://shop-nine-gules-15.vercel.app";
}

export function redirectUri() {
  return `${siteUrl()}/api/playbook/discord-callback`;
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}