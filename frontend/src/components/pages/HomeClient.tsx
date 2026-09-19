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
        <SectionReveal className="pb-28">
          <div className="container-hero">
            <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#181922] via-[#0d0e13] to-[#08080c] p-8 sm:p-16 overflow-hidden text-center shadow-2xl">
              <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
                  Bespoke Consultation
                </span>
                <MaskedHeading>
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-bold uppercase tracking-tight">
                    READY TO BRING YOUR VISION TO LIFE?
                  </h2>
                </MaskedHeading>
                <p className="text-sm sm:text-base text-[#a3a4b2] leading-relaxed">
                  Book a private appointment at our Bhadam studio or request luxury doorstep home service across Gujarat. Every piece is custom-crafted to your anatomy.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <MagneticElement strength={0.4}>
                    <Link
                      href="/booking"
                      className="btn-gold px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl inline-block"
                    >
                      <RollingText text="START CONSULTATION" />
                    </Link>
                  </MagneticElement>

                  <MagneticElement strength={0.3}>
                    <Link
                      href="/portfolio"
                      className="btn-secondary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] inline-block"
                    >
                      <RollingText text="EXPLORE PORTFOLIO" />
                    </Link>
                  </MagneticElement>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </main>

      <Footer />
    </>
  );
}
