import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ARTIST_COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set({
      name: ARTIST_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return NextResponse.json({
      success: true,
      message: "Artist session terminated successfully.",
      redirect: "/artist-access",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error terminating session." },
      { status: 500 }
    );
  }
}
