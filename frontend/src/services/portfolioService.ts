import axios from "axios";
import { PORTFOLIO_ITEMS, VIDEO_REELS } from "@/constants";
import type { PortfolioItem, VideoReel, InstagramPostItem } from "@/types";

const STORAGE_KEY = "jainik_portfolio_items_v4";
const DJANGO_API_BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000";

function getStoredItems(): PortfolioItem[] {
  if (typeof window === "undefined") return PORTFOLIO_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PORTFOLIO_ITEMS));
      return PORTFOLIO_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < PORTFOLIO_ITEMS.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PORTFOLIO_ITEMS));
      return PORTFOLIO_ITEMS;
    }
    return parsed;
  } catch {
    return PORTFOLIO_ITEMS;
  }
}

function saveStoredItems(items: PortfolioItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save portfolio items", err);
  }
}

export const portfolioService = {
  async getPortfolio(params?: {
    style?: string;
    placement?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PortfolioItem[]> {
    let items: PortfolioItem[] = [];

    // 1. First attempt to query Django PostgreSQL REST API
    try {
      const qParams: Record<string, any> = {
        page: params?.page || 1,
        page_size: params?.pageSize || 48,
      };
      if (params?.style && params.style !== "All") qParams.style = params.style;
      if (params?.placement && params.placement !== "All") qParams.placement = params.placement;
      if (params?.search && params.search.trim()) qParams.search = params.search.trim();

      const response = await axios.get(`${DJANGO_API_BASE}/api/portfolio/`, {
        params: qParams,
        timeout: 2500,
      });

      const data = response.data;
      const results = data.results || data;

      if (Array.isArray(results) && results.length > 0) {
        items = results.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.caption || item.description || "Master custom tattoo artwork by Jainik Patel",
          image: item.primary_image || item.media_items?.[0]?.storage_url || "/images/tattoos/shiva-trishul-tattoo.jpg",
          healed_image: item.primary_image || item.media_items?.[0]?.storage_url || "/images/tattoos/shiva-trishul-tattoo.jpg",
          style_tags: item.tags_list && item.tags_list.length > 0 ? item.tags_list : [item.style_name || "Custom"],
          primary_style: item.style_name || "Custom",
          placement: item.placement_name || "Custom Placement",
          size: "Custom Size",
          color_type: item.color_type || "Black & Grey",
          session_hours: item.session_hours || 4,
          is_featured: item.featured ?? true,
          is_published: item.published ?? true,
          artist_name: "Jainik Patel",
          artist_id: "jainik-patel",
          created_at: item.published_at ? item.published_at.split("T")[0] : new Date().toISOString().split("T")[0],
          client_story: `Crafted with devotion by Jainik Patel (@tatoo.iconic). Engagement: ${item.like_count || 4500} likes.`,
        }));
      }
    } catch {
      // Backend offline or loading, continue to stored & JSON sources
    }

    // 2. If backend didn't return or returned fallback, merge stored items + live instagram posts
    if (items.length === 0) {
      items = getStoredItems();
    }

    // Also merge all synced Instagram posts from /api/instagram/feed if in browser
    if (typeof window !== "undefined") {
      try {
        const igRes = await fetch("/api/instagram/feed");
        if (igRes.ok) {
          const igData = await igRes.json();
          if (igData && Array.isArray(igData.posts)) {
            const existingImages = new Set(items.map((i) => i.image));
            const existingIds = new Set(items.map((i) => i.id));

            const igMapped: PortfolioItem[] = igData.posts
              .filter((p: InstagramPostItem) => !existingIds.has(p.id) && !existingImages.has(p.media_url))
              .map((p: InstagramPostItem) => ({
                id: p.id,
                title: p.caption.split("\n")[0].slice(0, 65) || "Custom Tattoo Artwork",
                description: p.caption,
                image: p.media_url,
                healed_image: p.media_url,
                video_url: p.video_url,
                style_tags: p.style_tags || [p.style_tag || "Custom"],
                primary_style: p.style_tag || "Fine Line",
                placement: p.placement || "Forearm",
                size: "Custom Size",
                color_type: "Black & Grey",
                session_hours: 5,
                is_featured: true,
                is_published: true,
                artist_name: "Jainik Patel",
                artist_id: "jainik-patel",
                created_at: p.timestamp ? p.timestamp.split("T")[0] : new Date().toISOString().split("T")[0],
                client_story: `Crafted by master artist Jainik Patel (@tatoo.iconic). Engagement: ${p.like_count || '4.5k'} likes on Instagram.`,
              }));

            if (igMapped.length > 0) {
              items = [...items, ...igMapped];
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // 3. Apply Style, Placement & Search Filters
    if (params?.style && params.style !== "All") {
      const qStyle = params.style.toLowerCase();
      items = items.filter(
        (item) =>
          item.style_tags.some((t) => t.toLowerCase().includes(qStyle)) ||
          item.primary_style.toLowerCase() === qStyle
      );
    }

    if (params?.placement && params.placement !== "All") {
      const qPlace = params.placement.toLowerCase();
      items = items.filter((item) => item.placement.toLowerCase().includes(qPlace));
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.style_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return items;
  },

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    try {
      const res = await axios.get(`${DJANGO_API_BASE}/api/portfolio/${id}/`, { timeout: 3000 });
      if (res.data) {
        const item = res.data;
        return {
          id: item.id,
          title: item.title,
          description: item.description || item.caption,
          image: item.media_items?.[0]?.storage_url || item.media_items?.[0]?.source_url || "",
          healed_image: item.media_items?.[0]?.storage_url || item.media_items?.[0]?.source_url || "",
          style_tags: item.tags?.map((t: any) => t.name) || [item.style?.name || "Custom"],
          primary_style: item.style?.name || "Custom",
          placement: item.placement?.name || "Custom",
          size: "Custom",
          color_type: item.color_type || "Black & Grey",
          session_hours: item.session_hours || 4,
          is_featured: item.featured,
          is_published: item.published,
          artist_name: "Jainik Patel",
          artist_id: "jainik-patel",
          created_at: item.published_at?.split("T")[0] || "",
          client_story: `Crafted at Tattoo Iconic studio.`,
        };
      }
    } catch {
      // Fallback
    }
    const items = getStoredItems();
    return items.find((i) => i.id === id) || null;
  },

  async getFeatured(): Promise<PortfolioItem[]> {
    const items = getStoredItems();
    return items.filter((i) => i.is_featured);
  },

  async getReels(): Promise<VideoReel[]> {
    return VIDEO_REELS;
  },

  async createPortfolioItem(data: Omit<PortfolioItem, "id" | "created_at">): Promise<PortfolioItem> {
    const items = getStoredItems();
    const newItem: PortfolioItem = {
      ...data,
      id: `piece-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
    };
    items.unshift(newItem);
    saveStoredItems(items);
    return newItem;
  },

  async updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
    const items = getStoredItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    saveStoredItems(items);
    return items[index];
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    const items = getStoredItems();
    const filtered = items.filter((i) => i.id !== id);
    saveStoredItems(filtered);
    return true;
  },
};

