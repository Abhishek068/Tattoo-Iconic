import type { AvailabilitySlot } from "@/types";

export const WORKING_TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
];

export const INITIAL_BLOCKED_DATES = [
  "2026-09-06",
  "2026-09-07",
  "2026-09-13",
  "2026-09-14",
  "2026-09-21",
];

export const INITIAL_AVAILABILITY_SLOTS: AvailabilitySlot[] = [
  {
    date: "2026-09-24",
    available_slots: ["02:00 PM", "04:30 PM", "06:00 PM"],
    is_blocked: false,
  },
  {
    date: "2026-09-25",
    available_slots: ["10:00 AM", "05:00 PM"],
    is_blocked: false,
  },
  {
    date: "2026-09-26",
    available_slots: ["04:00 PM"],
    is_blocked: false,
  },
  {
    date: "2026-09-27",
    available_slots: ["10:00 AM", "12:00 PM", "02:30 PM"],
    is_blocked: false,
  },
  {
    date: "2026-09-28",
    available_slots: ["10:00 AM", "04:00 PM"],
    is_blocked: false,
  },
];
