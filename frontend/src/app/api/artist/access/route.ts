import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, getArtistSecret, ARTIST_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiting map for access attempts
// key: client IP or identifier, value: { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 60 * 1000; // 1 minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "local-client";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many access attempts. Please wait 1 minute before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const enteredKey = typeof body?.securityKey === "string" ? body.securityKey.trim() : "";

    const expectedSecret = getArtistSecret();

    if (!expectedSecret) {
      console.error(
        "[Artist Access Error] ARTIST_DASHBOARD_SECRET is not configured on the production server (fail-closed)."
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication is unavailable. Studio security key is not configured on the server.",
        },
        { status: 503 }
      );
    }

    if (!enteredKey || enteredKey.length === 0) {
      return NextResponse.json(
        { success: false, message: "Security key is required." },
        { status: 400 }
      );
    }

    // Timing-safe comparison to prevent timing attacks
    const keyValid = timingSafeEqual(enteredKey, expectedSecret);

    if (!keyValid) {
      // Artificial slight delay to resist automated timing/brute-force attacks
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { success: false, message: "Invalid access key." },
        { status: 401 }
      );
    }

    // Generate authenticated signed session
    const sessionToken = await createSessionToken(expectedSecret);

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = cookies();
    cookieStore.set({
      name: ARTIST_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({
      success: true,
      message: "Artist access authenticated successfully.",
      redirect: "/artist-dashboard",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication process encountered an error." },
      { status: 500 }
    );
  }
}

/**
 * Constant-time comparison between two strings
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
