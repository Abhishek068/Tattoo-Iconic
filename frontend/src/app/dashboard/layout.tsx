"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  Users,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ARTIST_PROFILE } from "@/constants";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "Bookings & Requests", icon: CalendarCheck },
  { href: "/dashboard/calendar", label: "Studio Calendar", icon: CalendarIcon },
  { href: "/dashboard/portfolio", label: "Portfolio Manager", icon: ImageIcon },
  { href: "/dashboard/customers", label: "Customer Directory", icon: Users },
  { href: "/dashboard/settings", label: "Studio Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-950 text-ink-100 antialiased">
      {/* ── Sidebar (Desktop & Mobile Drawer) ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-ink-900/95 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col justify-between",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Top Brand Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 border border-brand/40 text-brand font-display font-bold text-sm">
                JP
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white tracking-wide">
                  Jainik Patel
                </p>
                <p className="text-[10px] text-amber-300/80 font-sans uppercase">
                  Artist Studio Portal
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-ink-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                    isActive
                      ? "bg-brand text-white font-semibold shadow-md shadow-brand/20"
                      : "text-ink-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Return to Public Site */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-amber-500/40 relative">
              <Image
                src={ARTIST_PROFILE.profile_image}
                alt={ARTIST_PROFILE.full_name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {ARTIST_PROFILE.full_name}
              </p>
              <span className="text-[10px] text-emerald-400 block font-medium">
                ● Studio Online
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-ink-300 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <ArrowLeft size={14} />
            <span>View Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Dashboard Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink-950/85 backdrop-blur-xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-ink-400 hover:text-white bg-white/5 border border-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="font-display text-lg font-bold text-white tracking-wide">
              {NAV_ITEMS.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label || "Artist Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Autoclave Logged Today</span>
            </span>

            <Link
              href="/booking"
              target="_blank"
              className="btn-primary text-xs py-1.5 px-3.5 inline-flex items-center gap-1"
            >
              <span>Booking Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Subpage Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
