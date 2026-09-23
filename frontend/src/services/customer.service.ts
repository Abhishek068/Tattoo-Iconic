import { INITIAL_CUSTOMERS } from "@/data/customers";
import type { CustomerRecord } from "@/types";

const STORAGE_KEY = "tattoo_iconic_customers_v5";

function getStoredCustomers(): CustomerRecord[] {
  if (typeof window === "undefined") return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return parsed;
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

function saveStoredCustomers(items: CustomerRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save customers to local storage:", err);
  }
}

export const customerService = {
  async getAll(search?: string): Promise<CustomerRecord[]> {
    let items = getStoredCustomers();
    if (search && search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.preferred_style.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }
    return items;
  },

  async getById(id: string): Promise<CustomerRecord | null> {
    const items = getStoredCustomers();
    return items.find((c) => c.id === id) || null;
  },

  async update(id: string, updates: Partial<CustomerRecord>): Promise<CustomerRecord | null> {
    const items = getStoredCustomers();
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    saveStoredCustomers(items);
    return items[index];
  },

  async create(data: Omit<CustomerRecord, "id">): Promise<CustomerRecord> {
    const items = getStoredCustomers();
    const newCustomer: CustomerRecord = {
      ...data,
      id: `cust-${Date.now()}`,
    };
    items.unshift(newCustomer);
    saveStoredCustomers(items);
    return newCustomer;
  },

  async delete(id: string): Promise<boolean> {
    const items = getStoredCustomers();
    const filtered = items.filter((c) => c.id !== id);
    saveStoredCustomers(filtered);
    return true;
  },
};
