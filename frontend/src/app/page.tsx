"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Star,
} from "lucide-react";
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
import {
  ARTIST_PROFILE,
  CUSTOMER_REVIEWS,
} from "@/constants";
import { LusionSpotlightCard, MagneticElement, RollingText } from "@/components/ui/LusionEffects";

export default function HomePage() {
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
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: smoothEase }}
                >
                  <LusionSpotlightCard
                    tiltStrength={5}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all duration-300 h-full"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400" />
                          ))}
                        </div>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">
                          {rev.healed_time}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-amber-200">
                        {rev.tattoo_piece}
                      </p>

                      <p className="text-xs text-[#cacad3] italic leading-relaxed">
                        “{rev.comment}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{rev.client_name}</p>
                        <p className="text-[10px] text-[#747688]">{rev.client_location}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-300 uppercase">
                        {rev.service_type}
                      </span>
                    </div>
                  </LusionSpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ========================================================================= */}
        {/* CHAPTER 06: FINAL CINEMATIC CTA                                           */}
        {/* ========================================================================= */}
        <section id="cta" className="py-24 sm:py-32 lg:py-40 relative overflow-hidden bg-transparent">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-15">
            <Image
              src="/images/tattoos/shiva-trishul-tattoo.jpg"
              alt="Final CTA Backdrop"
              fill
              className="object-cover filter grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060709] via-transparent to-[#060709]" />
          </div>

          <div className="container-hero relative z-10 text-center max-w-4xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">
              Limited Monthly Commissions
            </span>

            <MaskedHeading>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-8xl font-bold uppercase tracking-tight text-white leading-tight">
                MAKE IT PERMANENT.
              </h2>
            </MaskedHeading>

            <p className="text-base sm:text-lg text-[#cacad3] max-w-xl mx-auto leading-relaxed">
              Book your private studio atelier appointment in Bhadam, Rajpipla or request a luxury home service session anywhere in Gujarat.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <MagneticElement strength={0.35}>
                <Link
                  href="/booking"
                  className="btn-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/50 inline-flex items-center gap-3 group"
                >
                  <RollingText text="BOOK A SESSION" />
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-300" />
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
