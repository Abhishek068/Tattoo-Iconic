import { INITIAL_INSTAGRAM_POSTS } from "@/data/instagram";
import type { InstagramPostItem } from "@/types";

export const instagramService = {
  async getFeed(): Promise<InstagramPostItem[]> {
    return INITIAL_INSTAGRAM_POSTS;
  },

  async triggerSync(customUrl?: string) {
    return {
      success: true,
      message: "Sync simulation processed with @tatoo.iconic",
      synced_at: new Date().toISOString(),
    };
  },
};
