import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ARTIST_COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(ARTIST_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role,
    expires_at: session.exp,
  });
}
