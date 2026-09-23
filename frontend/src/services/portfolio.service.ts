import { INITIAL_TATTOOS } from "@/data/tattoos";
import { VIDEO_REELS } from "@/constants";
import type { PortfolioItem, VideoReel } from "@/types";

const STORAGE_KEY = "tattoo_iconic_portfolio_items_v5";

function getStoredItems(): PortfolioItem[] {
  if (typeof window === "undefined") return INITIAL_TATTOOS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TATTOOS));
      return INITIAL_TATTOOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TATTOOS));
      return INITIAL_TATTOOS;
    }
    return parsed;
  } catch {
    return INITIAL_TATTOOS;
  }
}

function saveStoredItems(items: PortfolioItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save portfolio items to local store:", err);
  }
}

export const portfolioService = {
  async getAll(params?: {
    style?: string;
    placement?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PortfolioItem[]> {
    let items = getStoredItems();

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

  // Alias for backward compatibility
  async getPortfolio(params?: {
    style?: string;
    placement?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PortfolioItem[]> {
    return this.getAll(params);
  },

  async getById(id: string): Promise<PortfolioItem | null> {
    if (!id) return null;
    const items = getStoredItems();
    const cleanId = decodeURIComponent(String(id)).toLowerCase().trim();
    return (
      items.find((i) => {
        const itemCleanId = i.id.toLowerCase().trim();
        const itemSlug = i.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        return (
          itemCleanId === cleanId ||
          itemCleanId === `piece-${cleanId}` ||
          itemCleanId.replace("piece-", "") === cleanId ||
          itemSlug === cleanId ||
          i.title.toLowerCase().trim() === cleanId
        );
      }) || null
    );
  },

  async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    return this.getById(id);
  },

  async getFeatured(): Promise<PortfolioItem[]> {
    const items = getStoredItems();
    return items.filter((i) => i.is_featured && i.is_published);
  },

  async getReels(): Promise<VideoReel[]> {
    return VIDEO_REELS;
  },

  async create(data: Omit<PortfolioItem, "id" | "created_at">): Promise<PortfolioItem> {
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

  async createPortfolioItem(data: Omit<PortfolioItem, "id" | "created_at">): Promise<PortfolioItem> {
    return this.create(data);
  },

  async update(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
    const items = getStoredItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    saveStoredItems(items);
    return items[index];
  },

  async updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
    return this.update(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    const items = getStoredItems();
    const filtered = items.filter((i) => i.id !== id);
    saveStoredItems(filtered);
    return true;
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    return this.delete(id);
  },
};
