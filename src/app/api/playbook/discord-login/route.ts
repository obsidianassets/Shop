import { NextResponse } from "next/server";
import { redirectUri } from "@/lib/playbook-auth";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("DISCORD_CLIENT_ID is not set", { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "identify guilds.members.read",
    redirect_uri: redirectUri(),
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params.toString()}`
  );
}