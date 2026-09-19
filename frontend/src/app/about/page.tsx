"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Instagram,
  MessageCircle,
  Home,
  MapPin,
  HeartHandshake,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTIST_PROFILE, PORTFOLIO_ITEMS } from "@/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="container-hero py-12 sm:py-16 space-y-20">
        {/* Hero Banner */}
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight font-bold">
              Meet Jainik Patel
            </h1>

            <p className="text-base sm:text-lg text-ink-200 leading-relaxed">
              Tattooing is more than applying pigment to skin—it is a permanent anatomical sculpture, an intimate milestone, and a lifelong collaboration between client and artist.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/booking" className="btn-primary px-7 py-3.5 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>Book a Session with Jainik</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/\+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-6 py-3.5 text-sm inline-flex items-center gap-2 text-emerald-400"
                >
                  <MessageCircle size={16} />
                  <span>Direct WhatsApp</span>
                </a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl border border-amber-500/25 bg-gradient-to-b from-ink-900/90 via-ink-950 to-ink-950 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col items-center justify-between min-h-[460px] overflow-hidden group">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-amber-500/20 via-brand/15 to-transparent blur-3xl pointer-events-none" />

              <div className="relative my-auto flex items-center justify-center py-4">
                <div className="relative h-60 w-60 sm:h-72 sm:w-72 rounded-full p-1 shadow-2xl shadow-black/90 group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/tattoo-iconic-logo.png?v=5"
                    alt="Tattoo Iconic — Jainik Patel Studio Emblem"
                    className="h-full w-full object-contain rounded-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              <div className="relative z-10 w-full rounded-2xl border border-white/10 bg-ink-950/80 p-4 sm:p-5 backdrop-blur-md mt-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Solo Master Tattoo Artist
                </p>
                <h3 className="font-display text-xl sm:text-2xl text-white font-bold mt-0.5">
                  {ARTIST_PROFILE.full_name}
                </h3>
                <p className="text-xs text-ink-300 mt-1 flex items-center gap-1.5">
                  <span>10+ Years Mastery</span>
                  <span className="text-white/20">·</span>
                  <span className="text-amber-300/90">7,000+ Inked · Bhadam, Rajpipla</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Narrative & Journey */}
        <section className="grid gap-12 lg:grid-cols-12 items-start pt-10">
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              The Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              From Fine Arts to Permanent Body Inking
            </h2>
            <p className="text-xs text-ink-400 leading-relaxed">
              A decade-long obsession with line precision, anatomical contouring, and sterile clinical excellence.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6 text-sm sm:text-base text-ink-300 leading-relaxed">
            <p>
              Jainik Patel began his artistic journey rooted in classical drawing, illustration, and graphic arts. Drawn to the permanence and emotional depth of tattoo art, he spent years mastering the intricate mechanics of single-needle fine-line and high-contrast blackwork.
            </p>
            <p>
              Over the past 10+ years, Jainik has completed more than 7,000+ custom tattoos for collectors from across Gujarat and India. Unlike large, loud multi-artist studios where clients often feel rushed through a conveyor-belt schedule, Jainik created a bespoke private atelier model centered around undivided focus, tranquil luxury, and unhurried craftsmanship.
            </p>
            <p>
              Recognizing that many high-profile collectors, busy executives, and private clients prefer the comfort and discretion of their own residence, Jainik developed a full-scale **Luxury Home Service** protocol—bringing hospital-grade sterilization and mobile ergonomic equipment straight to your home across Narmada and surrounding regions.
            </p>
          </div>
        </section>

        {/* Studio & Sterility Standards */}
        <section className="glass-card p-8 sm:p-12 border-emerald-500/20 bg-gradient-to-r from-ink-950 via-surface-card to-ink-950">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-display text-3xl sm:text-4xl text-white">
                Sterile Studio &amp; Safe Home Protocol
              </h2>
              <p className="text-sm text-ink-300 leading-relaxed">
                Whether tattooing in our private Bhadam atelier suite or in your living room, hygiene is absolute. Class-B vacuum autoclave logs, single-use surgical cartridges, and REACH-compliant organic vegan inks.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { title: "Class-B Autoclave", desc: "Medical vacuum sterilization unit tested daily." },
                { title: "Single-Use EO Gas Cartridges", desc: "Surgical steel precision needles opened in front of you." },
                { title: "REACH Compliant Vegan Inks", desc: "Heavy-metal-free, organic German & US pigments." },
                { title: "Medical Second-Skin Dressing", desc: "Breathable protective barrier for flawless healing." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-ink-400 pl-6">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Archive Preview */}
        <section className="space-y-6 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">Portfolio Highlights</span>
              <h2 className="font-display text-3xl text-white mt-1">Signature Pieces by Jainik</h2>
            </div>
            <Link href="/portfolio" className="btn-secondary text-xs py-2.5 px-4">
              View All 100+ Pieces &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PORTFOLIO_ITEMS.slice(0, 3).map((piece) => (
              <Link
                key={piece.id}
                href={`/portfolio/${piece.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 shadow-xl"
              >
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="font-display text-sm font-bold text-white">{piece.title}</p>
                  <p className="text-[11px] text-amber-300">{piece.placement} · {piece.primary_style}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
