import { NextResponse } from "next/server";
import { INITIAL_INSTAGRAM_POSTS, INITIAL_INSTAGRAM_DASHBOARD } from "@/data/instagram";

export const dynamic = "force-dynamic";

export async function GET() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "tatoo.iconic";

  return NextResponse.json({
    success: true,
    source: "curated_studio_instagram_feed",
    handle: `@${handle}`,
    total_posts: INITIAL_INSTAGRAM_POSTS.length,
    loaded_count: INITIAL_INSTAGRAM_POSTS.length,
    artist: "Jainik Patel",
    phone: "+918238767100",
    experience: "10+ Years",
    clients_inked: "7,000+",
    last_synced: INITIAL_INSTAGRAM_DASHBOARD.stats.last_sync_at,
    posts: INITIAL_INSTAGRAM_POSTS,
  });
}
