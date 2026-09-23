"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

// ── Spinner ──
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand" />
    </div>
  );
}

// ── Empty State ──
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-ink-300">{icon}</div>}
      <h3 className="text-lg font-medium text-ink-700">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Status Badge ──
export function StatusBadge({ status, config }: { status: string; config: Record<string, { label: string; color: string }> }) {
  const s = config[status] || { label: status, color: "bg-ink-100 text-ink-600" };
  return <span className={cn("badge", s.color)}>{s.label}</span>;
}

// ── Star Rating ──
export function StarRating({ rating, size = 16, interactive, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={cn("transition-colors", interactive && "cursor-pointer hover:text-yellow-400", !interactive && "cursor-default")}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? "#f59e0b" : "none"}
            stroke={star <= rating ? "#f59e0b" : "#d1d5db"} strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Avatar ──
export function Avatar({ src, name, size = "md" }: { src?: string | null; name: string; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-lg" };
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return src ? (
    <img src={src} alt={name} className={cn("rounded-full object-cover", dims[size])} />
  ) : (
    <div className={cn("flex items-center justify-center rounded-full bg-brand/10 font-medium text-brand", dims[size])}>
      {initials}
    </div>
  );
}

// ── Modal ──
export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn("relative z-10 w-full rounded-xl bg-white p-6 shadow-xl animate-fade-in", maxWidth)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-600">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Skeleton ──
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-ink-100", className)} />;
}

// ── Page Header ──
export function PageHeader({ title, description, action }: {
  title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="section-heading">{title}</h1>
        {description && <p className="section-subheading">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Filter Chip ──
export function FilterChip({ label, active, onClick, size = "md" }: {
  label: string; active: boolean; onClick: () => void; size?: "sm" | "md";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border transition-colors",
        size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        active ? "border-brand bg-brand text-white" : "border-ink-200 text-ink-600 hover:border-ink-400"
      )}
    >
      {label}
    </button>
  );
}

// ── WhatsApp Button & Icon ──
export { WhatsAppButton, WhatsAppIcon } from "./WhatsAppButton";

