"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Home,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { bookingService } from "@/services/bookingService";
import { portfolioService } from "@/services/portfolioService";
import type { BookingRequest, PortfolioItem } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);

  useEffect(() => {
    bookingService.getBookings().then(setBookings);
    portfolioService.getPortfolio().then((items) => setPortfolioCount(items.length));
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const confirmedSessions = bookings.filter((b) => b.status === "confirmed");
  const homeServiceCount = bookings.filter((b) => b.service_type === "home_service");

  const totalEstimatedRevenue = bookings.reduce(
    (acc, b) => acc + (b.estimated_price || 0),
    0
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 border-amber-500/20 bg-gradient-to-r from-ink-950 via-surface-card to-ink-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
              Welcome back, Jainik
            </h2>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold">
              Live Atelier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-300">
            You have <strong className="text-amber-300 font-semibold">{pendingRequests.length} new booking requests</strong> awaiting your custom review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="btn-primary text-xs py-2.5 px-5 shadow-md shadow-brand/20"
          >
            Review Inquiries
          </Link>
          <Link
            href="/dashboard/calendar"
            className="btn-secondary text-xs py-2.5 px-4"
          >
            Open Calendar
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Pending Inquiries */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 font-medium">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Clock size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-white">
            {pendingRequests.length}
          </p>
          <p className="text-[11px] text-amber-300/80">Requires concept review</p>
        </div>

        {/* 2. Confirmed Sessions */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 font-medium">Confirmed Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-white">
            {confirmedSessions.length}
          </p>
          <p className="text-[11px] text-emerald-400/80">Deposits paid &amp; scheduled</p>
        </div>

        {/* 3. Home Service Bookings */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 font-medium">Home Service Visits</span>
            <div className="p-2 rounded-xl bg-brand/20 text-brand-light">
              <Home size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-white">
            {homeServiceCount.length}
          </p>
          <p className="text-[11px] text-brand-light/80">Mobile inking appointments</p>
        </div>

        {/* 4. Portfolio Works */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 font-medium">Active Portfolio Works</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-white">
            {portfolioCount}
          </p>
          <p className="text-[11px] text-ink-400">Live on public portfolio</p>
        </div>
      </div>

      {/* Main Split Sections */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Inquiries Table */}
        <div className="lg:col-span-8 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-display text-lg text-white font-bold">
                Recent Appointment Requests
              </h3>
              <p className="text-xs text-ink-400 mt-0.5">
                New concepts submitted through the 7-step booking flow
              </p>
            </div>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-brand-light hover:underline flex items-center gap-1 font-medium"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {b.customer_name}
                    </p>
                    <span className="text-[10px] rounded-md bg-white/5 px-2 py-0.5 text-amber-200">
                      {b.tattoo_style}
                    </span>
                    {b.service_type === "home_service" && (
                      <span className="text-[10px] rounded-md bg-brand/20 text-brand-light px-2 py-0.5 font-medium flex items-center gap-1">
                        <Home size={10} /> Home Service
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 truncate max-w-md">
                    {b.placement} · &ldquo;{b.tattoo_description}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">{b.preferred_date}</p>
                    <span
                      className={`text-[10px] font-medium capitalize rounded-full px-2 py-0.5 block mt-0.5 ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : b.status === "pending"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-white/10 text-ink-300"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/bookings?id=${b.id}`}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Calendar Schedule */}
        <div className="lg:col-span-4 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-display text-lg text-white font-bold">Upcoming Sessions</h3>
            <Link href="/dashboard/calendar" className="text-xs text-brand-light hover:underline">
              Calendar &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {confirmedSessions.length === 0 ? (
              <p className="text-xs text-ink-400 py-4 text-center">No confirmed sessions yet.</p>
            ) : (
              confirmedSessions.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{s.customer_name}</span>
                    <span className="text-emerald-300 font-semibold">{s.preferred_time}</span>
                  </div>
                  <p className="text-[11px] text-ink-300">
                    {s.placement} ({s.tattoo_style})
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-ink-400 pt-1">
                    <CalendarIcon size={11} />
                    <span>{s.preferred_date}</span>
                    <span>·</span>
                    <span>{s.service_type === "home_service" ? "Home Service" : "Bhadam Studio"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
