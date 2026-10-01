import { NextRequest, NextResponse } from "next/server";
import { safeEqual, verify } from "@/lib/playbook-auth";

export async function POST(request: NextRequest) {
  const session = verify(request.cookies.get("oa_session")?.value);
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.UNLOCK_PASSWORD || "";
  if (!expected || !safeEqual(password, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}