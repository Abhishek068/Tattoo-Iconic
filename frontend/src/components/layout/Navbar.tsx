"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ArrowRight,
  MessageCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ARTIST_PROFILE } from "@/constants";
import { MagneticElement, RollingText } from "@/components/ui/LusionEffects";
import { WhatsAppButton, WhatsAppIcon } from "@/components/ui";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const smoothEase = [0.22, 1, 0.36, 1];

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Work" },
  { href: "/styles", label: "Styles" },
  { href: "/about", label: "About" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 select-none bg-transparent pointer-events-auto">
        <nav className="relative w-full flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14 bg-transparent">
          {/* ── Left: Tattoo Zone Style Studio Emblem with Magnetic Pull ── */}
          <MagneticElement strength={0.25}>
            <Link
              href="/"
              aria-label="Tattoo Iconic Home"
              className="group flex items-center gap-3.5 focus-visible:outline-none shrink-0"
            >
              <div className="relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-amber-500/40 bg-[#121319] group-hover:border-amber-400 transition-colors shadow-lg">
                <span className="font-serif text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#f3e5ab] via-[#c5a059] to-[#8c6b2d]">
                  JP
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#F5F0EB] uppercase group-hover:text-amber-200 transition-colors whitespace-nowrap">
                  TATTOO ICONIC
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] text-[#8e90a0] whitespace-nowrap">
                  JAINIK PATEL
                </span>
              </div>
            </Link>
          </MagneticElement>

          {/* ── Right: All Links from HOME to BOOK APPOINTMENT Grouped on Right ── */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* Minimalist Nav Links with Lusion Rolling Kinetic Letters */}
            <div className="hidden md:flex items-center gap-7 lg:gap-9">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/" && pathname === "/") ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <MagneticElement key={item.label} strength={0.2}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group text-xs lg:text-sm tracking-[0.15em] uppercase transition-colors duration-300 font-light whitespace-nowrap py-1 inline-block",
                        isActive
                          ? "text-[#C5A059] font-normal"
                          : "text-[#A3A4B2] hover:text-[#F5F0EB]"
                      )}
                    >
                      <RollingText text={item.label} active={isActive} />
                    </Link>
                  </MagneticElement>
                );
              })}
            </div>

            {/* Mobile 2-Line Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2 md:hidden cursor-pointer"
              aria-label="Open menu"
              type="button"
            >
              <span className="block h-[1.5px] w-6 bg-[#F5F0EB]" />
              <span className="block h-[1.5px] w-4 bg-[#F5F0EB] ml-auto" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Floating Bottom-Right Sticky WhatsApp Action ── */}
      <WhatsAppButton variant="floating" label="CHAT ON WHATSAPP" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. FULL-SCREEN / SLIDE-OVER LUXURY DARK MENU DRAWER            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex justify-end"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: smoothEase }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg h-full bg-[#090a0d] border-l border-amber-500/30 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center h-10 w-10">
                    <span className="font-serif text-2xl font-bold text-amber-300">JP</span>
                  </div>
                  <div>
                    <span className="font-serif text-lg font-bold tracking-[0.18em] text-[#f5f2eb] uppercase block">
                      JAINIK PATEL
                    </span>
                    <span className="text-[10px] text-[#a3a4b2] uppercase tracking-widest font-semibold block">
                      Tattoo Artist · Gujarat
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 p-2.5 text-[#cacad3] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-8 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400/80 mb-3">
                  Navigation Directory
                </p>
                <nav className="space-y-1">
                  {[
                    { href: "/", label: "Home", num: "01" },
                    { href: "/about", label: "About Artist", num: "02" },
                    { href: "/portfolio", label: "Work Gallery", num: "03" },
                    { href: "/#styles", label: "Tattoo Styles", num: "04" },
                    { href: "/#experience", label: "Studio & VIP Home", num: "05" },
                    { href: "/#process", label: "Protocol", num: "06" },
                    { href: "/reviews", label: "Client Reviews", num: "07" },
                    { href: "/contact", label: "Contact & Location", num: "08" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300",
                        pathname === item.href
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-200"
                          : "hover:bg-white/5 text-[#cacad3] hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#747688] group-hover:text-amber-400 transition-colors">
                          {item.num}
                        </span>
                        <span className="font-serif text-base sm:text-lg tracking-wide">
                          {item.label}
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[#747688] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/booking"
                    onClick={() => setMenuOpen(false)}
                    className="btn-gold py-3 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={15} />
                    <span>Book Session</span>
                  </Link>

                  <a
                    href={createWhatsAppUrl({ context: "home" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Jainik Patel on WhatsApp"
                    className="btn-secondary py-3 text-xs sm:text-sm font-semibold text-center flex items-center justify-center gap-1.5 text-amber-300 hover:text-white"
                  >
                    <WhatsAppIcon size={15} />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs text-[#a3a4b2] space-y-1.5">
                  <p className="flex items-center gap-2 text-white font-semibold">
                    <MapPin size={13} className="text-amber-400" />
                    <span>Private Studio: Bhadam, Rajpipla, Gujarat</span>
                  </p>
                  <p className="flex items-center gap-2 text-[11px]">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>100% Sterile Medical Autoclave Certified</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
