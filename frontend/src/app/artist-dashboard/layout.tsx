"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  Instagram,
  MessageSquare,
  Scissors,
  Star,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ARTIST_PROFILE } from "@/constants";
import { artistAuthService } from "@/services/artist-auth.service";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { href: "/artist-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/artist-dashboard/enquiries", label: "Enquiries (Sheets)", icon: FileSpreadsheet },
  { href: "/artist-dashboard/portfolio", label: "Portfolio Manager", icon: ImageIcon },
  { href: "/artist-dashboard/bookings", label: "Bookings & Requests", icon: CalendarCheck },
  { href: "/artist-dashboard/calendar", label: "Studio Calendar", icon: CalendarIcon },
  { href: "/artist-dashboard/services", label: "Services & Rates", icon: Scissors },
  { href: "/artist-dashboard/reviews", label: "Client Reviews", icon: Star },
  { href: "/artist-dashboard/customers", label: "Customer Directory", icon: Users },
  { href: "/artist-dashboard/messages", label: "Consultation Inbox", icon: MessageSquare },
  { href: "/artist-dashboard/instagram", label: "Instagram Hub", icon: Instagram },
  { href: "/artist-dashboard/settings", label: "Studio Settings", icon: Settings },
];

export default function ArtistDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await artistAuthService.logout();
      toast.success("Logged out of Artist Dashboard");
      router.push("/artist-access");
      router.refresh();
    } catch {
      toast.error("Logout error");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#07080a] text-ink-100 antialiased">
      {/* ── Sidebar (Desktop & Mobile Drawer) ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0c0e14]/95 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col justify-between",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="overflow-y-auto">
          {/* Top Brand Header */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link href="/artist-dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-sm">
                JP
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                  Tattoo Iconic
                </p>
                <p className="text-[10px] text-amber-300/80 font-sans tracking-widest uppercase">
                  Artist Studio Atelier
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#8e90a0] hover:text-white p-1"
              aria-label="Close sidebar"
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
                      ? "bg-[#c5a059] text-[#0a0a0a] font-bold shadow-md shadow-amber-500/20"
                      : "text-[#a3a4b2] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-white/10 space-y-2.5 bg-[#090b10]">
          {/* Artist Online Status */}
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
                ● Master Artist Online
              </span>
            </div>
          </div>

          {/* View Public Website */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-[#a3a4b2] hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <ArrowLeft size={13} />
            <span>View Public Website</span>
          </Link>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors w-full cursor-pointer disabled:opacity-50"
          >
            <LogOut size={13} />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Dashboard Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#07080a]/90 backdrop-blur-xl px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-[#8e90a0] hover:text-white bg-white/5 border border-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">
              {NAV_ITEMS.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label || "Artist Atelier"}
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
