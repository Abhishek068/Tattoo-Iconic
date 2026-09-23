import { INITIAL_SERVICES } from "@/data/services";
import type { ServiceOffering } from "@/types";

const STORAGE_KEY = "tattoo_iconic_services_v5";

function getStoredServices(): ServiceOffering[] {
  if (typeof window === "undefined") return INITIAL_SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return parsed;
  } catch {
    return INITIAL_SERVICES;
  }
}

function saveStoredServices(items: ServiceOffering[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save services to local storage:", err);
  }
}

export const serviceService = {
  async getAll(): Promise<ServiceOffering[]> {
    return getStoredServices();
  },

  async getServices(): Promise<ServiceOffering[]> {
    return this.getAll();
  },

  async getBySlug(slug: string): Promise<ServiceOffering | null> {
    const items = getStoredServices();
    return items.find((s) => s.slug === slug) || null;
  },

  async getServiceBySlug(slug: string): Promise<ServiceOffering | null> {
    return this.getBySlug(slug);
  },

  async update(id: string, updates: Partial<ServiceOffering>): Promise<ServiceOffering | null> {
    const items = getStoredServices();
    const index = items.findIndex((s) => s.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    saveStoredServices(items);
    return items[index];
  },

  async create(data: Omit<ServiceOffering, "id">): Promise<ServiceOffering> {
    const items = getStoredServices();
    const newService: ServiceOffering = {
      ...data,
      id: `srv-${Date.now()}`,
    };
    items.push(newService);
    saveStoredServices(items);
    return newService;
  },

  async delete(id: string): Promise<boolean> {
    const items = getStoredServices();
    const filtered = items.filter((s) => s.id !== id);
    saveStoredServices(filtered);
    return true;
  },
};
