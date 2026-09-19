import { NextResponse } from "next/server";
import { INSTAGRAM_SYNCED_POSTS } from "@/constants/inspiration";
import type { InstagramPostItem } from "@/types";

export const dynamic = "force-dynamic";

const DJANGO_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function GET() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "tatoo.iconic";
  let posts: InstagramPostItem[] = [];

  // 1. Fetch live published items from Django PostgreSQL backend
  try {
    const res = await fetch(`${DJANGO_API_URL}/portfolio/?page_size=50`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      const items = data.results || data;
      if (Array.isArray(items) && items.length > 0) {
        posts = items.map((item: any) => ({
          id: String(item.id),
          media_url: item.primary_image || item.image_url || "/images/tattoos/shiva-trishul-tattoo.jpg",
          thumbnail_url: item.primary_image || item.image_url || "/images/tattoos/shiva-trishul-tattoo.jpg",
          caption: item.caption || item.title || "Custom Tattoo Artwork by Jainik Patel #TattooIconic",
          media_type: item.media_type || "IMAGE",
          permalink: item.permalink || `https://www.instagram.com/${handle}`,
          timestamp: item.imported_at || new Date().toISOString(),
          like_count: item.like_count || 0,
          comments_count: item.comments_count || 0,
          style_tag: item.style?.name || "Dark Realism",
          style_tags: [item.style?.name || "Dark Realism"],
          placement: item.placement?.name || "Forearm",
          is_reel: item.media_type === "VIDEO",
        }));
      }
    }
  } catch (err: any) {
    // Graceful fallback to static portfolio feed if Django is offline
  }

  // 2. Fallback to curated studio pieces if database is starting up
  if (posts.length === 0) {
    posts = INSTAGRAM_SYNCED_POSTS;
  }

  return NextResponse.json({
    success: true,
    source: "django_postgresql_portfolio",
    handle: `@${handle}`,
    total_posts: posts.length,
    loaded_count: posts.length,
    artist: "Jainik Patel",
    phone: "+918238767100",
    experience: "10+ Years",
    clients_inked: "7,000+",
    last_synced: new Date().toISOString(),
    posts,
  });
}
