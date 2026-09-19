"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Home, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { MaskedHeading, smoothEase } from "@/components/ui/CinematicScroll";

export function AtelierServiceExperience() {
  return (
    <section id="services" className="relative py-20 sm:py-28 overflow-hidden select-none">
      <div className="container-hero relative z-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.28em] text-amber-400 font-bold">
            <Sparkles size={14} />
            <span>Dual Inking Pathways</span>
          </div>
          <MaskedHeading>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-bold uppercase tracking-tight">
              STUDIO &amp; HOME SERVICE
            </h2>
          </MaskedHeading>
          <p className="text-xs sm:text-sm text-[#a3a4b2] max-w-xl mx-auto leading-relaxed">
            Experience the private sanctuary of our Bhadam studio suite or request a sterile mobile clinic at your residence anywhere in Gujarat.
          </p>
        </div>

        {/* Dual Luxury Editorial Panels */}
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Pathway 1: Private Studio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="group rounded-3xl border border-white/10 bg-gradient-to-b from-[#111218] via-[#090a0d] to-[#090a0d] p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl hover:border-amber-500/40 transition-all duration-500"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <MapPin size={22} />
                </div>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-mono font-bold text-amber-200 uppercase tracking-widest">
                  Pathway 01
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Customer Visits Atelier
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
                  PRIVATE STUDIO
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#cacad3] leading-relaxed">
                Tranquil 1-on-1 private appointment in Bhadam, Rajpipla. Acoustic ambient serenity, ergonomic hydraulic seating, and medical Class-B vacuum autoclave sterility.
              </p>

              <ul className="space-y-2 text-xs text-[#a3a4b2] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>100% Private Atelier Suite (No overlapping clients)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Single-use surgical cartridges opened in front of you</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Medical second-skin wrap &amp; aftercare kit included</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#747688]">Location: Bhadam, Rajpipla</span>
              <Link
                href="/booking?service=studio_visit"
                className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em]"
              >
                Book Studio Visit
              </Link>
            </div>
          </motion.div>

          {/* Pathway 2: Luxury VIP Home Service */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: smoothEase }}
            className="group rounded-3xl border border-white/10 bg-gradient-to-b from-[#111218] via-[#090a0d] to-[#090a0d] p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-2xl hover:border-emerald-500/40 transition-all duration-500"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <Home size={22} />
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono font-bold text-emerald-200 uppercase tracking-widest">
                  Pathway 02 · VIP
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Artist Travels to You
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
                  HOME SERVICE
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#cacad3] leading-relaxed">
                Jainik brings the full sterile mobile studio directly to your private residence across Gujarat. Ultimate comfort, zero travel hassle, and strict VIP confidentiality.
              </p>

              <ul className="space-y-2 text-xs text-[#a3a4b2] pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Sanitized mobile workstation &amp; sterile barrier drape</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Available in Rajpipla, Vadodara, Bharuch, Surat &amp; Gujarat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Strict discretion &amp; 21-day WhatsApp healing support</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#747688]">Location: At Your Residence</span>
              <Link
                href="/booking?service=home_service"
                className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em]"
              >
                Request Home Service
              </Link>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-[#747688] mt-8">
          * Note: Exact private studio directions and parking instructions are provided upon appointment confirmation.
        </p>
      </div>
    </section>
  );
}
