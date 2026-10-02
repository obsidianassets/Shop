import { NextRequest, NextResponse } from "next/server";
import { redirectUri, safeEqual, sign, siteUrl } from "@/lib/playbook-auth";

export async function GET(request: NextRequest) {
  const home = `${siteUrl()}/playbook/`;
  const code = request.nextUrl.searchParams.get("code");
  const denied = request.nextUrl.searchParams.get("error");

  const fail = (reason: string) =>
    NextResponse.redirect(`${home}?auth_error=${encodeURIComponent(reason)}`);

  if (denied) return fail("discord_denied");
  if (!code) return fail("missing_code");

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_CLIENT_ROLE_ID;
  if (!clientId || !clientSecret || !guildId || !roleId || !process.env.SESSION_SECRET) {
    return fail("server_not_configured");
  }

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
    }),
  });
  if (!tokenRes.ok) return fail("token_exchange_failed");
  const tokens = await tokenRes.json();
  const accessToken = tokens.access_token as string | undefined;
  if (!accessToken) return fail("token_exchange_failed");

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) return fail("user_fetch_failed");
  const user = await userRes.json();

  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${guildId}/member`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (memberRes.status === 404) return fail("not_in_server");
  if (!memberRes.ok) return fail("member_fetch_failed");
  const member = await memberRes.json();
  const roles: string[] = Array.isArray(member.roles) ? member.roles : [];
  if (!roles.some((id) => safeEqual(id, roleId))) return fail("missing_client_role");

  const maxAgeMs = 60 * 60 * 1000;
  const token = sign({
    sub: user.id,
    username: user.username,
    exp: Date.now() + maxAgeMs,
  });

  const response = NextResponse.redirect(home);
  response.cookies.set("oa_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return response;
}