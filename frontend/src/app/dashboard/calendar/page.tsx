"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { bookingService } from "@/services/bookingService";
import type { BookingRequest } from "@/types";

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>(["2026-09-06", "2026-09-07", "2026-09-13", "2026-09-14", "2026-09-21"]);

  useEffect(() => {
    bookingService.getBookings().then(setBookings);
  }, []);

  const daysInMonth = 30; // Sept 2026
  const monthName = "September 2026";

  function toggleBlockDate(dateStr: string) {
    if (blockedDates.includes(dateStr)) {
      setBlockedDates(blockedDates.filter((d) => d !== dateStr));
    } else {
      setBlockedDates([...blockedDates, dateStr]);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
            Studio Calendar &amp; Schedule
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Manage your daily appointments, home service travel slots, and studio off-days.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 flex items-center">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  view === v
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "text-ink-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Header Month Strip */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl text-white font-bold">{monthName}</h3>
          <span className="text-xs text-amber-300 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            {bookings.filter((b) => b.status === "confirmed").length} Confirmed Sessions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-white/10 bg-white/5 text-ink-300 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded-xl border border-white/10 bg-white/5 text-ink-300 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {view === "month" && (
        <div className="glass-card p-4 border-white/15 overflow-hidden">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 pb-2 text-center text-xs font-semibold uppercase tracking-wider text-ink-400 border-b border-white/10">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
              const dayBookings = bookings.filter((b) => b.preferred_date === dateStr);
              const isBlocked = blockedDates.includes(dateStr);

              return (
                <div
                  key={dayNum}
                  onClick={() => toggleBlockDate(dateStr)}
                  className={`min-h-[110px] rounded-2xl border p-2.5 transition-all text-xs flex flex-col justify-between cursor-pointer ${
                    isBlocked
                      ? "border-red-500/30 bg-red-500/5 text-ink-500"
                      : dayBookings.length > 0
                      ? "border-amber-500/40 bg-ink-900/90 text-white"
                      : "border-white/5 bg-ink-950/60 text-ink-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{dayNum}</span>
                    {isBlocked ? (
                      <span className="text-[9px] text-red-400 font-bold uppercase">Time Off</span>
                    ) : dayBookings.length > 0 ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        className={`rounded-lg p-1.5 text-[10px] truncate font-medium ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        <p className="truncate font-bold">{b.customer_name}</p>
                        <p className="text-[9px] opacity-80">{b.preferred_time} · {b.placement}</p>
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] text-ink-500">
                    {isBlocked ? "Click to unblock" : "Click to block off"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day Summary View */}
      {(view === "week" || view === "day") && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-lg text-white font-bold">Upcoming Agenda</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand-light font-bold">
                    {b.preferred_time}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.customer_name}</h4>
                    <p className="text-ink-400">{b.tattoo_style} ({b.placement}) · {b.preferred_date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {b.service_type === "home_service" ? (
                    <span className="rounded-md bg-brand/20 text-brand-light px-2 py-1 text-[10px] font-semibold flex items-center gap-1">
                      <Home size={11} /> Home Service
                    </span>
                  ) : (
                    <span className="rounded-md bg-amber-500/20 text-amber-300 px-2 py-1 text-[10px] font-semibold flex items-center gap-1">
                      <MapPin size={11} /> Studio Suite
                    </span>
                  )}
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-1 text-[10px] font-bold capitalize">
                    {b.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
