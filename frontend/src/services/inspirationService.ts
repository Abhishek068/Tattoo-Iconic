import { INSPIRATION_CATALOG } from "@/constants/inspiration";
import type { InspirationItem, MoodboardItem } from "@/types";

const INSPIRATION_STORAGE_KEY = "tattoo_iconic_inspiration_items_v2";
const MOODBOARD_STORAGE_KEY = "tattoo_iconic_client_moodboard_v1";

function getStoredInspirations(): InspirationItem[] {
  if (typeof window === "undefined") return INSPIRATION_CATALOG;
  try {
    const raw = localStorage.getItem(INSPIRATION_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INSPIRATION_STORAGE_KEY, JSON.stringify(INSPIRATION_CATALOG));
      return INSPIRATION_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < INSPIRATION_CATALOG.length) {
      localStorage.setItem(INSPIRATION_STORAGE_KEY, JSON.stringify(INSPIRATION_CATALOG));
      return INSPIRATION_CATALOG;
    }
    return parsed;
  } catch {
    return INSPIRATION_CATALOG;
  }
}

function saveStoredInspirations(items: InspirationItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INSPIRATION_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save inspirations", err);
  }
}

export const inspirationService = {
  async getInspirations(params?: {
    style?: string;
    placement?: string;
    source?: string;
    search?: string;
  }): Promise<InspirationItem[]> {
    let items = getStoredInspirations();

    if (params?.source && params.source !== "All") {
      const qSource = params.source.toLowerCase();
      items = items.filter((item) => item.source.toLowerCase() === qSource);
    }

    if (params?.style && params.style !== "All") {
      const qStyle = params.style.toLowerCase();
      items = items.filter(
        (item) =>
          item.primary_style.toLowerCase().includes(qStyle) ||
          item.style_tags.some((t) => t.toLowerCase().includes(qStyle))
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

  async addInspiration(item: Omit<InspirationItem, "id">): Promise<InspirationItem> {
    const items = getStoredInspirations();
    const newItem: InspirationItem = {
      ...item,
      id: `insp-${Date.now()}`,
    };
    items.unshift(newItem);
    saveStoredInspirations(items);
    return newItem;
  },

  async deleteInspiration(id: string): Promise<boolean> {
    const items = getStoredInspirations();
    const filtered = items.filter((i) => i.id !== id);
    saveStoredInspirations(filtered);
    return true;
  },

  // ── Moodboard Local Management ──
  getMoodboard(): MoodboardItem[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(MOODBOARD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleMoodboardItem(item: {
    id: string;
    title: string;
    image: string;
    style: string;
    placement: string;
    source: string;
  }): { isSaved: boolean; total: number } {
    if (typeof window === "undefined") return { isSaved: false, total: 0 };
    try {
      const current = this.getMoodboard();
      const exists = current.some((m) => m.item_id === item.id);
      let updated: MoodboardItem[];

      if (exists) {
        updated = current.filter((m) => m.item_id !== item.id);
      } else {
        updated = [
          ...current,
          {
            id: `mb-${Date.now()}`,
            item_id: item.id,
            title: item.title,
            image: item.image,
            style: item.style,
            placement: item.placement,
            source: item.source,
            saved_at: new Date().toISOString(),
          },
        ];
      }

      localStorage.setItem(MOODBOARD_STORAGE_KEY, JSON.stringify(updated));
      return { isSaved: !exists, total: updated.length };
    } catch {
      return { isSaved: false, total: 0 };
    }
  },

  clearMoodboard(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(MOODBOARD_STORAGE_KEY);
  },
};
