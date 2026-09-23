"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CinematicInkCanvas } from "@/components/canvas/CinematicInkCanvas";
import { ContinuousWorldHero } from "@/components/home/ContinuousWorldHero";
import { CinematicStorytellingSection } from "@/components/home/CinematicStorytellingSection";
import { Floating3DPortfolio } from "@/components/home/Floating3DPortfolio";
import { FluidStyleExperience } from "@/components/home/FluidStyleExperience";
import {
  ScrollProgressBar,
  MaskedHeading,
  MaskedImageReveal,
  SectionReveal,
  smoothEase,
} from "@/components/ui/CinematicScroll";
import { ARTIST_PROFILE, CUSTOMER_REVIEWS } from "@/constants";
import { LusionSpotlightCard, MagneticElement, RollingText } from "@/components/ui/LusionEffects";

export function HomeClient() {
  return (
    <>
      {/* ── GPU-Accelerated Fluid Ink Simulation ── */}
      <CinematicInkCanvas />

      {/* ── Top Golden Hairline Progress Indicator ── */}
      <ScrollProgressBar />

      <Navbar />

      <main className="relative overflow-hidden bg-[#060709] text-[#f5f2eb]">
        {/* ========================================================================= */}
        {/* CHAPTER 01: IMMERSIVE 3D CONTINUOUS HERO WORLD                            */}
        {/* ========================================================================= */}
        <div id="hero">
          <ContinuousWorldHero />
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 02: MEET YOUR TATTOO ARTIST (CINEMATIC STORYTELLING)               */}
        {/* ========================================================================= */}
        <CinematicStorytellingSection />

        {/* ========================================================================= */}
        {/* CHAPTER 03: 3D FLOATING FEATURED PORTFOLIO                                */}
        {/* ========================================================================= */}
        <div id="portfolio">
          <Floating3DPortfolio />
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 04: LIQUID TATTOO STYLE EXPERIENCE                                */}
        {/* ========================================================================= */}
        <div id="styles">
          <FluidStyleExperience />
        </div>

        {/* ========================================================================= */}
        {/* CHAPTER 05: CLIENT STORIES (VERIFIED TESTIMONIALS)                         */}
        {/* ========================================================================= */}
        <SectionReveal id="stories">
          <div className="container-hero">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
                  Verified Experiences
                </span>
                <MaskedHeading>
                  <h2 className="font-serif text-3xl sm:text-5xl text-[#f5f2eb] font-bold uppercase mt-2">
                    CLIENT STORIES
                  </h2>
                </MaskedHeading>
                <p className="text-sm text-[#a3a4b2] mt-1">
                  5.0 ★ client ratings and healed tattoo accounts from collectors across Gujarat.
                </p>
              </div>

              <MagneticElement strength={0.3}>
                <Link
                  href="/reviews"
                  className="btn-secondary px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] group inline-block"
                >
                  <RollingText text="READ ALL REVIEWS" />
                </Link>
              </MagneticElement>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CUSTOMER_REVIEWS.map((rev, idx) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: smoothEase }}
                  className="h-full"
                >
                  <LusionSpotlightCard
                    tiltStrength={5}
                    className="h-full rounded-2xl border border-white/[0.08] bg-[#101116] p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          Verified
                        </span>
                      </div>

                      <p className="text-xs text-[#cacad3] italic leading-relaxed mb-4">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <p className="text-xs font-bold text-[#f5f2eb]">{rev.client_name}</p>
                      <p className="text-[10px] text-[#78798a]">{rev.tattoo_piece} · {rev.client_location}</p>
                    </div>
                  </LusionSpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ========================================================================= */}
        {/* CHAPTER 06: FINAL INVITATION / BESPOKE BOOKING CTA                        */}
        {/* ========================================================================= */}
        <section className="relative w-full py-28 sm:py-36 overflow-hidden flex items-center justify-center text-center bg-[#060709]">
          {/* ── Full Width Transparent Advanced Tattoo Masterpiece Background ── */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/cta-tattoo-bg.jpg"
              alt="Advanced Tattoo Masterpiece Artwork"
              fill
              className="object-cover object-center scale-100 opacity-90"
              priority
            />
            {/* Seamless Top & Bottom Feathered Fade — No Divider Lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060709] via-transparent to-[#060709]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060709]/60 via-transparent to-[#060709]/60" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Ambient Golden Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />

          <div className="container-page relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/60 px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
                Bespoke Consultation
              </span>
            </div>

            <MaskedHeading>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-bold uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                READY TO BRING YOUR VISION TO LIFE?
              </h2>
            </MaskedHeading>

            <p className="text-sm sm:text-base text-[#e2e4f0] leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-light">
              Book a private appointment at our Bhadam studio or request luxury doorstep home service across Gujarat. Every piece is custom-crafted to your anatomy.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <MagneticElement strength={0.4}>
                <Link
                  href="/booking"
                  className="btn-gold px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 inline-block"
                >
                  <RollingText text="START CONSULTATION" />
                </Link>
              </MagneticElement>

              <MagneticElement strength={0.3}>
                <Link
                  href="/portfolio"
                  className="btn-secondary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md border-white/20 hover:border-amber-400/60 inline-block text-white"
                >
                  <RollingText text="EXPLORE PORTFOLIO" />
                </Link>
              </MagneticElement>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
