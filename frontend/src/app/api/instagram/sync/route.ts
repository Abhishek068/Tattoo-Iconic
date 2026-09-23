import { NextResponse } from "next/server";
import { instagramApi } from "@/services/instagramApi";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const autoPublish = Boolean(body?.auto_publish);
    const result = await instagramApi.triggerSync(autoPublish);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to perform Instagram sync simulation" },
      { status: 500 }
    );
  }
}
