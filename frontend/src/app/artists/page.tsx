"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, ArrowRight, Award, ShieldCheck, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MASTER_ARTIST, CURATED_PORTFOLIO } from "@/constants";
import { formatPrice } from "@/lib/utils";

export default function ArtistProfilePage() {
  return (
    <>
      <Navbar />
      <main className="container-page py-12 sm:py-16">
        {/* Master Profile Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Portrait & Sticky Spec Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl border border-amber-500/25 bg-gradient-to-b from-ink-900/90 via-ink-950 to-ink-950 p-6 shadow-2xl flex items-center justify-center min-h-[360px] overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
              <div className="relative h-60 w-60 rounded-full p-1 shadow-2xl shadow-black/90 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/tattoo-iconic-logo.png?v=5"
                  alt="Tattoo Iconic Logo"
                  className="h-full w-full object-contain rounded-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>

            {/* Quick Specs */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-ink-400">Experience</span>
                <span className="text-sm font-bold text-white">{MASTER_ARTIST.experience_years} Years Mastery</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-ink-400">Consultation Deposit</span>
                <span className="text-sm font-bold text-amber-300">{formatPrice(MASTER_ARTIST.minimum_deposit)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-ink-400">Hourly Studio Rate</span>
                <span className="text-sm font-bold text-white">{formatPrice(MASTER_ARTIST.hourly_rate)}/hr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">Lead Time</span>
                <span className="text-sm font-bold text-emerald-400">Approx. {MASTER_ARTIST.booking_lead_days}–14 Days</span>
              </div>

              <div className="pt-2">
                <Link href="/booking" className="btn-primary w-full text-center py-3.5 text-sm">
                  <Calendar size={16} className="mr-2" />
                  Request Private Session
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Awards, Technique */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl text-white font-bold">
                {MASTER_ARTIST.full_name}
              </h1>
              <p className="text-amber-300 text-sm font-medium mt-1">
                {MASTER_ARTIST.title} · Bhadam, Rajpipla Studio
              </p>
            </div>

            <p className="text-base text-ink-200 leading-relaxed">
              {MASTER_ARTIST.bio}
            </p>

            {/* Specialties */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Primary Masteries &amp; Styles
              </h3>
              <div className="flex flex-wrap gap-2">
                {MASTER_ARTIST.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-amber-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Honors & Recognitions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Awards &amp; Industry Honors
              </h3>
              <div className="space-y-2.5">
                {MASTER_ARTIST.awards.map((award, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5"
                  >
                    <Award size={18} className="text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-ink-200 font-medium">{award}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Archive Preview */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-white">Recent Atelier Pieces</h3>
                <Link href="/portfolio" className="text-xs text-brand-light hover:underline flex items-center gap-1">
                  All Pieces <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {CURATED_PORTFOLIO.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.id}`}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 shadow-md"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="25vw"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
