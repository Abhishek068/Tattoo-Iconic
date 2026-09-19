import { INSTAGRAM_SYNCED_POSTS } from "@/constants/inspiration";
import type { InstagramPostItem } from "@/types";

export const instagramService = {
  async getFeed(): Promise<InstagramPostItem[]> {
    try {
      const res = await fetch("/api/instagram/feed", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.posts)) {
          return data.posts;
        }
      }
    } catch (e) {
      console.warn("Using offline fallback for Instagram posts:", e);
    }
    return INSTAGRAM_SYNCED_POSTS;
  },

  async triggerSync(customUrl?: string) {
    try {
      const res = await fetch("/api/instagram/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_url: customUrl }),
      });
      return await res.json();
    } catch (e) {
      return {
        success: false,
        error: "Network error triggering Instagram sync",
      };
    }
  },
};
