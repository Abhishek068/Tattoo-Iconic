import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMMM yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM yyyy");
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, "h:mm a");
}

export function formatPrice(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}

export function truncate(text: string, length: number): string {
  return text.length <= length ? text : text.slice(0, length).trimEnd() + "…";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getMinBookingDate(leadDays = 3): string {
  const date = new Date();
  date.setDate(date.getDate() + leadDays);
  return date.toISOString().split("T")[0];
}
