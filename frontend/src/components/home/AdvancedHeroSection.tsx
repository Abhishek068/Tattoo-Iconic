"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1];

interface MasterpieceHeroItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  style: string;
  image: string;
  placement: string;
  hours: string;
}

const HERO_PIECES: MasterpieceHeroItem[] = [
  {
    id: "lotus-mandala",
    tag: "Sacred Geometry & Fine Line",
    title: "Sacred Lotus Mandala & Micro-Geometry",
    subtitle: "Shoulder & Upper Back Spine Flow",
    style: "Fine Line & Sacred Geometry",
    image: "/images/tattoos/lotus-mandala-tattoo.jpg",
    placement: "Upper Back & Shoulder",
    hours: "5.5 Hours",
  },
  {
    id: "shiva-trishul",
    tag: "Devotional Cosmic Realism",
    title: "Lord Shiva Cosmic Trishul & Damru",
    subtitle: "Sacred Saffron Tilak & Stipple Dotwork",
    style: "Spiritual Realism",
    image: "/images/tattoos/shiva-trishul-tattoo.jpg",
    placement: "Forearm & Inner Arm",
    hours: "6.5 Hours",
  },
  {
    id: "hanuman-ji",
    tag: "Spiritual Realism & Calligraphy",
    title: "Lord Hanuman Ji — Mukut & Sanskrit Lettering",
    subtitle: "Sacred Chintamani Tilak & Micro-Dotwork",
    style: "Spiritual Realism",
    image: "/images/tattoos/hanuman-tattoo.png",
    placement: "Forearm Placement",
    hours: "6.0 Hours",
  },
  {
    id: "lion-king",
    tag: "Dark Realism & Portraiture",
    title: "Royal Lion King & Imperial Crown",
    subtitle: "Velvety Dark Contrast & Volumetric Fur",
    style: "Dark Realism",
    image: "/images/tattoos/lion-king-tattoo.jpg",
    placement: "Full Bicep & Shoulder",
    hours: "8.0 Hours",
  },
  {
    id: "radha-krishna",
    tag: "Divine Devotional Fine Line",
    title: "Radha Krishna Divine Flute & Peacock Feather",
    subtitle: "Whisper-Thin Linework & Shading",
    style: "Fine Line",
    image: "/images/tattoos/radha-krishna-tattoo.jpg",
    placement: "Forearm / Wrist",
    hours: "5.0 Hours",
  },
];

export function AdvancedHeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentPiece = HERO_PIECES[activeIdx];

  // Subtle auto dissolve between masterpieces in background
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_PIECES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden bg-[#0d0e12] select-none">
      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 1. BACKGROUND CENTERPIECE PHOTOGRAPHY & CHIAROSCURO VIGNETTE */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* Active Masterpiece Image with Smooth Dissolve */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPiece.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.58, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: smoothEase }}
            className="relative h-full w-full max-w-5xl"
          >
            <Image
              src={currentPiece.image}
              alt={currentPiece.title}
              fill
              priority
              className="object-contain object-center filter grayscale contrast-125 brightness-90"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Chiaroscuro Radial Glows & Heavy Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/40 to-[#0d0e12]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12] via-transparent to-[#0d0e12]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#0d0e12_85%)]" />

        {/* Warm Golden Glow Behind Tattoo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-600/15 blur-[140px]" />
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 2. FLANKING RADIATING GOLDEN TRIBAL ARCS (DRIBBBLE SIGNATURE) */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {/* Left Radiating Gold Arcs */}
      <div className="absolute left-2 sm:left-6 lg:left-14 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-80 sm:opacity-90">
        <svg
          className="w-24 sm:w-44 lg:w-60 h-48 sm:h-72 lg:h-96"
          viewBox="0 0 200 300"
          fill="none"
        >
          <path
            d="M185,15 C115,55 45,130 45,200 C45,245 70,275 95,295"
            stroke="#d4af37"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M195,45 C135,85 75,150 75,210 C75,250 95,275 115,290"
            stroke="#c5a059"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M175,80 C125,120 90,170 90,225 C90,250 110,270 125,280"
            stroke="#ecc94b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M160,115 C125,145 105,185 105,230"
            stroke="#f6e05e"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Right Radiating Gold Arcs (Mirrored) */}
      <div className="absolute right-2 sm:right-6 lg:right-14 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-80 sm:opacity-90 scale-x-[-1]">
        <svg
          className="w-24 sm:w-44 lg:w-60 h-48 sm:h-72 lg:h-96"
          viewBox="0 0 200 300"
          fill="none"
        >
          <path
            d="M185,15 C115,55 45,130 45,200 C45,245 70,275 95,295"
            stroke="#d4af37"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M195,45 C135,85 75,150 75,210 C75,250 95,275 115,290"
            stroke="#c5a059"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M175,80 C125,120 90,170 90,225 C90,250 110,270 125,280"
            stroke="#ecc94b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M160,115 C125,145 105,185 105,230"
            stroke="#f6e05e"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 3. MAIN CENTER CONTENT & EDITORIAL HEADLINE                   */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <div className="container-hero relative z-20 flex flex-col items-center justify-center text-center my-auto px-4">
        {/* ── Signature Line 1: {EXPRESS} YOURSELF ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
          className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 leading-none"
        >
          <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-amber-400/90 font-light select-none">
            &#123;
          </span>
          <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[0.16em] text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            EXPRESS
          </span>
          <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-amber-400/90 font-light select-none">
            &#125;
          </span>
          <span className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[0.16em] text-white uppercase ml-1 sm:ml-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            YOURSELF
          </span>
        </motion.div>

        {/* ── Signature Line 2: UNLEASH A NEW DIMENSION OF ART ── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: smoothEase }}
          className="font-serif text-base sm:text-2xl md:text-3xl lg:text-4xl text-ink-200 font-normal tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-4 sm:mt-6 text-center"
        >
          UNLEASH A NEW{" "}
          <span className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-[0.28em] drop-shadow-md">
            DIMENSION
          </span>{" "}
          OF ART
        </motion.h2>

        {/* ── 4. CTA BUTTON & FLANKING FEATHER ARROWS ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
          className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-6 w-full max-w-2xl mx-auto"
        >
          {/* Left Boho Feather Arrow */}
          <div className="flex-1 flex justify-end">
            <svg
              className="w-16 sm:w-28 lg:w-36 h-5 sm:h-6 text-amber-400/80 shrink-0"
              viewBox="0 0 120 24"
              fill="none"
              stroke="currentColor"
            >
              {/* Feather Fletching on Left */}
              <path
                d="M4,12 L18,4 M4,12 L18,20 M10,12 L24,6 M10,12 L24,18 M16,12 L28,8 M16,12 L28,16"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Arrow Shaft */}
              <line x1="4" y1="12" x2="112" y2="12" strokeWidth="1.5" />
              {/* Arrow Head on Right */}
              <path
                d="M102,6 L114,12 L102,18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Central Book Appointment Button (Warm Copper-Gold Dribbble Box) */}
          <Link
            href="/booking"
            className="relative shrink-0 rounded-md bg-gradient-to-r from-[#b3743c] via-[#d49755] to-[#9c5f2b] px-7 sm:px-10 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-ink-950 shadow-2xl shadow-amber-900/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40 cursor-pointer"
          >
            <span>Book Appointment</span>
          </Link>

          {/* Right Boho Feather Arrow (Mirrored) */}
          <div className="flex-1 flex justify-start">
            <svg
              className="w-16 sm:w-28 lg:w-36 h-5 sm:h-6 text-amber-400/80 shrink-0 scale-x-[-1]"
              viewBox="0 0 120 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4,12 L18,4 M4,12 L18,20 M10,12 L24,6 M10,12 L24,18 M16,12 L28,8 M16,12 L28,16"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line x1="4" y1="12" x2="112" y2="12" strokeWidth="1.5" />
              <path
                d="M102,6 L114,12 L102,18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
