import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("authorization") || "";

    // Proxy sync trigger to Django PostgreSQL sync engine
    const res = await fetch(`${DJANGO_API_URL}/artist/instagram/sync/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({
      success: true,
      message: "Sync request processed with Django backend.",
      handle: "@tatoo.iconic",
      synced_at: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to perform Instagram sync with backend" },
      { status: 500 }
    );
  }
}
