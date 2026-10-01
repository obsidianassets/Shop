import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/lib/playbook-auth";

export async function GET(request: NextRequest) {
  const session = verify(request.cookies.get("oa_session")?.value);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}