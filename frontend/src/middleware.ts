import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, ARTIST_COOKIE_NAME } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Redirect legacy /dashboard routes to /artist-dashboard
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const targetPath = pathname.replace(/^\/dashboard/, "/artist-dashboard");
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = targetPath;
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Protect all /artist-dashboard routes server-side
  if (pathname === "/artist-dashboard" || pathname.startsWith("/artist-dashboard/")) {
    const sessionCookie = req.cookies.get(ARTIST_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);

    if (!session) {
      const accessUrl = req.nextUrl.clone();
      accessUrl.pathname = "/artist-access";
      accessUrl.searchParams.delete("callbackUrl");

      const response = NextResponse.redirect(accessUrl);

      // If an invalid or expired cookie was present, clear it
      if (sessionCookie) {
        response.cookies.set({
          name: ARTIST_COOKIE_NAME,
          value: "",
          path: "/",
          maxAge: 0,
        });
      }

      return response;
    }
  }

  // 3. If already authenticated and visiting /artist-access, redirect to /artist-dashboard
  if (pathname === "/artist-access") {
    const sessionCookie = req.cookies.get(ARTIST_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);
    if (session) {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = "/artist-dashboard";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/artist-dashboard/:path*",
    "/artist-dashboard",
    "/dashboard/:path*",
    "/dashboard",
    "/artist-access",
  ],
};
