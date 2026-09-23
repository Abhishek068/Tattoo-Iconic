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
import { CinematicReviewReel } from "@/components/home/CinematicReviewReel";
import {
  ScrollProgressBar,
  MaskedHeading,
  MaskedImageReveal,
  SectionReveal,
  smoothEase,
} from "@/components/ui/CinematicScroll";
import { ARTIST_PROFILE } from "@/constants";
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
        {/* CHAPTER 05: CINEMATIC 3D HORIZONTAL REVIEW REEL                           */}
        {/* ========================================================================= */}
        <div id="stories">
          <CinematicReviewReel />
        </div>

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
