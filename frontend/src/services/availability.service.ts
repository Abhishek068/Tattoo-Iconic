import { WORKING_TIME_SLOTS, INITIAL_BLOCKED_DATES, INITIAL_AVAILABILITY_SLOTS } from "@/data/availability";
import type { AvailabilitySlot } from "@/types";

const STORAGE_BLOCKED_KEY = "tattoo_iconic_blocked_dates_v5";

function getStoredBlockedDates(): string[] {
  if (typeof window === "undefined") return INITIAL_BLOCKED_DATES;
  try {
    const raw = localStorage.getItem(STORAGE_BLOCKED_KEY);
    return raw ? JSON.parse(raw) : INITIAL_BLOCKED_DATES;
  } catch {
    return INITIAL_BLOCKED_DATES;
  }
}

function saveStoredBlockedDates(dates: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BLOCKED_KEY, JSON.stringify(dates));
  } catch (err) {
    console.error("Failed to save blocked dates:", err);
  }
}

export const availabilityService = {
  async getWorkingTimeSlots(): Promise<string[]> {
    return WORKING_TIME_SLOTS;
  },

  async getBlockedDates(): Promise<string[]> {
    return getStoredBlockedDates();
  },

  async toggleBlockDate(dateStr: string): Promise<string[]> {
    const current = getStoredBlockedDates();
    let updated: string[];
    if (current.includes(dateStr)) {
      updated = current.filter((d) => d !== dateStr);
    } else {
      updated = [...current, dateStr];
    }
    saveStoredBlockedDates(updated);
    return updated;
  },

  async getSlotsForDate(dateStr: string): Promise<AvailabilitySlot> {
    const blockedDates = getStoredBlockedDates();
    const isBlocked = blockedDates.includes(dateStr);
    const existing = INITIAL_AVAILABILITY_SLOTS.find((s) => s.date === dateStr);

    return {
      date: dateStr,
      available_slots: isBlocked ? [] : existing ? existing.available_slots : WORKING_TIME_SLOTS,
      is_blocked: isBlocked,
    };
  },
};
