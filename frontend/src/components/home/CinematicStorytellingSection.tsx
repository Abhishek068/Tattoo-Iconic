"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LusionSpotlightCard, MagneticElement, RollingText } from "@/components/ui/LusionEffects";

const STORY_BEATS = [
  {
    num: "01",
    label: "THE ATELIER",
    text: "With more than 10 years tattooing professionally, Jainik Patel is one of Gujarat's most experienced and respected artists. Tattoo Iconic in Bhadam, Rajpipla is the private studio he built around that experience: quiet, considered, client-first.",
  },
  {
    num: "02",
    label: "THE PHILOSOPHY",
    text: "Jainik is an award-winning artist whose work is rooted in technical precision, sacred spiritual iconography, and genuine care for the people he tattoos. Every piece begins with a conversation: understanding the meaning behind the work, the story it tells, and the person who will carry it.",
  },
  {
    num: "03",
    label: "THE CRAFT",
    text: "Specialising in black and grey realism, sacred Hindu deities, fine line work, and custom anatomical designs, Jainik brings a meticulous eye for detail and hospital-grade autoclave sterilization to every session at the private Rajpipla atelier and VIP home sessions across Gujarat.",
  },
];

const slowCinematicEase = [0.16, 1, 0.3, 1];

export function CinematicStorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeBeat, setActiveBeat] = useState(0);

  return (
    <section
      id="artist"
      ref={containerRef}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-transparent perspective-[1200px]"
    >
      {/* Ambient background gold glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.07)_0%,transparent_70%)] blur-[150px] pointer-events-none" />

      <div className="container-hero relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT: CINEMATIC PORTRAIT & MASTER BADGE (5 COLS - SLOW FLY IN)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{
              opacity: 0,
              x: -110,
              y: 35,
              scale: 0.92,
              rotateY: 12,
              filter: "blur(14px)",
            }}
            animate={
              isInView
                ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotateY: 0,
                  filter: "blur(0px)",
                }
                : {}
            }
            transition={{ duration: 1.5, delay: 0.1, ease: slowCinematicEase }}
            style={{ transformStyle: "preserve-3d" }}
            className="lg:col-span-5 relative w-full mx-auto"
          >
            <LusionSpotlightCard
              tiltStrength={7}
              className="relative aspect-[3/4] max-h-[580px] w-full rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#181920] to-[#0a0a0d] shadow-2xl group"
            >
              {/* Main Portrait Artwork */}
              <Image
                src="/images/tattoos/shiva-trishul-tattoo.jpg"
                alt="Jainik Patel, Solo Master Tattoo Artist at Tattoo Iconic Gujarat"
                fill
                className="object-cover object-center filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-black/25 to-transparent pointer-events-none" />

              {/* Emblem Overlay Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.1, delay: 0.6, ease: slowCinematicEase }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#08090c]/85 border border-white/10 backdrop-blur-md flex items-center justify-between z-30"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative h-12 w-12 rounded-full border border-amber-500/40 bg-[#121319] flex items-center justify-center shrink-0 shadow-lg">
                    <span className="font-serif text-xl font-bold text-amber-300">JP</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
                      Master Tattoo Artist
                    </p>
                    <h3 className="font-serif text-base text-white font-bold">
                      Jainik Patel
                    </h3>
                    <p className="text-[11px] text-[#a3a4b2]">
                      10+ Years · Gujarat Atelier
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono font-bold text-amber-300 block">7,000+</span>
                  <span className="text-[10px] text-[#747688] uppercase tracking-wider">Inked</span>
                </div>
              </motion.div>
            </LusionSpotlightCard>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RIGHT: STORYTELLING EDITORIAL NARRATIVE (7 COLS - SLOW FLY IN)  */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 lg:pl-6 space-y-8">
            {/* Header Stagger Reveal */}
            <div className="space-y-2">
              <motion.p
                initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.9, delay: 0.2, ease: slowCinematicEase }}
                className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-semibold"
              >
                Meet Your Tattoo Artist
              </motion.p>

              <div className="overflow-hidden py-1">
                <motion.h2
                  initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
                  animate={isInView ? { y: "0%", opacity: 1, filter: "blur(0px)" } : {}}
                  transition={{ duration: 1.2, delay: 0.3, ease: slowCinematicEase }}
                  className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-[#F5F0EB]"
                >
                  Jainik Patel
                </motion.h2>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.0, delay: 0.45, ease: slowCinematicEase }}
                className="pt-1 space-y-0.5"
              >
                <p className="text-sm sm:text-base text-[#A3A4B2] font-normal">
                  Award-winning Gujarat tattoo artist · 10+ years' experience
                </p>
                <p className="text-xs sm:text-sm text-[#8e90a0] font-light">
                  Solo Master Tattoo Artist & Studio Founder
                </p>
              </motion.div>
            </div>

            {/* ── Storytelling Chapters / Narrative Beats (Slow Staggered Fly-In) ── */}
            <div className="space-y-6 pt-2">
              {STORY_BEATS.map((beat, idx) => (
                <motion.div
                  key={beat.num}
                  initial={{
                    opacity: 0,
                    x: 75,
                    y: 20,
                    filter: "blur(8px)",
                  }}
                  animate={
                    isInView
                      ? {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        filter: "blur(0px)",
                      }
                      : {}
                  }
                  transition={{
                    duration: 1.15,
                    delay: 0.55 + idx * 0.2,
                    ease: slowCinematicEase,
                  }}
                  onMouseEnter={() => setActiveBeat(idx)}
                  className={`group relative pl-6 transition-all duration-500 cursor-default ${activeBeat === idx ? "opacity-100 translate-x-1" : "opacity-75 hover:opacity-100"
                    }`}
                >
                  {/* Left Golden Timeline Beam with Height Reveal */}
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.9, delay: 0.65 + idx * 0.2, ease: slowCinematicEase }}
                    style={{ transformOrigin: "top" }}
                    className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] transition-colors duration-400 ${activeBeat === idx
                        ? "bg-gradient-to-b from-[#C5A059] to-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                        : "bg-white/10 group-hover:bg-white/30"
                      }`}
                  />

                  {/* Beat Tag */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-[#C5A059] font-bold">
                      {beat.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#A3A4B2]">
                      {beat.label}
                    </span>
                  </div>

                  {/* Narrative Body */}
                  <p className="text-sm sm:text-base text-[#cacad3] leading-relaxed font-light">
                    {beat.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ── Editorial Footer Actions with Lusion Magnetic Pull (Slow Fly In) ── */}
            <motion.div
              initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 1.1, delay: 1.15, ease: slowCinematicEase }}
              className="pt-4 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <MagneticElement strength={0.25}>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#F5F0EB] border-b border-[#F5F0EB]/30 pb-1 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 font-medium group"
                >
                  <RollingText text="Read Full Biography" />
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-amber-400" />
                </Link>
              </MagneticElement>

              <MagneticElement strength={0.25}>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#A3A4B2] border-b border-[#A3A4B2]/30 pb-1 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 font-medium group"
                >
                  <RollingText text="Tattoos Gujarat" />
                </Link>
              </MagneticElement>

              <MagneticElement strength={0.3}>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#C5A059] border-b border-[#C5A059]/50 pb-1 hover:text-[#f3e5ab] hover:border-[#f3e5ab] transition-all duration-300 font-medium group"
                >
                  <RollingText text="Book Appointment" />
                </Link>
              </MagneticElement>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
