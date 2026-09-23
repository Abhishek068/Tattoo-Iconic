"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

// Ultra-luxury decelerating cinematic bezier curve
const cinematicEase = [0.16, 1, 0.3, 1];

// 5 High-Standard Creative Tattoo Masterworks for Hero Carousel with Synchronized Quotes
const HERO_SLIDES = [
  {
    src: "/images/hero/slide-1-lion-crown.jpg",
    alt: "Royal Lion King & Imperial Crown Dark Realism Tattoo",
    title: "Royal Lion & Imperial Crown",
    line1: "ETCHED",
    line2: "IN",
    line3: "LEGACY.",
    quote: "Ink is not merely art on skin — it is your soul made visible forever.",
    styleBadge: "Master Dark Realism & Imperial Crown",
  },
  {
    src: "/images/hero/slide-2-trishul-mandala.jpg",
    alt: "Sacred Lord Shiva Trishul & Geometric Mandala Forearm Tattoo",
    title: "Sacred Trishul & Mandala",
    line1: "SACRED",
    line2: "IN",
    line3: "DEVOTION.",
    quote: "Har Har Mahadev — Eternal cosmic energy etched in timeless sacred geometry.",
    styleBadge: "Single-Needle Trishul & Sacred Mandala",
  },
  {
    src: "/images/hero/slide-3-mahadev-cosmic.jpg",
    alt: "Meditative Lord Shiva Mahadev & Cosmic Trishul Shoulder Masterpiece",
    title: "Lord Shiva Mahadev",
    line1: "IMMORTAL",
    line2: "ON",
    line3: "SKIN.",
    quote: "Silence within, supreme power without — spiritual vibrations immortalized forever.",
    styleBadge: "Devotional Lord Shiva Portraiture",
  },
  {
    src: "/images/hero/slide-4-back-mandala-lion.jpg",
    alt: "Intricate Full Back Mandala & Lion Atelier Masterpiece",
    title: "Full Back Sacred Mandala",
    line1: "CRAFT",
    line2: "YOUR",
    line3: "STORY.",
    quote: "Your body is a living temple of art, sculpted with unyielding mastery.",
    styleBadge: "Full-Scale Back Anatomical Realism",
  },
  {
    src: "/images/hero/slide-5-hanuman-devotion.jpg",
    alt: "Devotional Lord Hanuman Ji with Saffron Tilak & Sanskrit Mandala",
    title: "Lord Hanuman Ji Devotion",
    line1: "WEAR",
    line2: "YOUR",
    line3: "POWER.",
    quote: "Jai Bajrangbali — Unbreakable strength and divine protection etched forever.",
    styleBadge: "Devanagari Sanskrit Calligraphy & Realism",
  },
];

export function ContinuousWorldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Trigger entrance sequence immediately on mount (0.0s)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // ── Automatic 5-Second Background Slide Transition ──
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Scroll-Linked Spatial Z-Axis Camera Travel ──
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });

  // Camera Traveling Physics when scrolling through Hero into Chapter 02
  const scrollBgY = useTransform(scrollSmooth, [0, 1], [0, 140]);
  const scrollBgScale = useTransform(scrollSmooth, [0, 1], [1, 1.12]);

  const scrollTypeY = useTransform(scrollSmooth, [0, 1], [0, -150]);
  const scrollTypeOpacity = useTransform(scrollSmooth, [0, 0.75], [1, 0]);
  const scrollTypeScale = useTransform(scrollSmooth, [0, 1], [1, 0.94]);

  // ── Real-time 3D Perspective Tilt Physics ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springRotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    { stiffness: 90, damping: 24 }
  );
  const springRotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
    { stiffness: 90, damping: 24 }
  );

  const bgTranslateX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-16, 16]),
    { stiffness: 80, damping: 26 }
  );
  const bgTranslateY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-16, 16]),
    { stiffness: 80, damping: 26 }
  );

  const fgTranslateX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-24, 24]),
    { stiffness: 100, damping: 22 }
  );
  const fgTranslateY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-24, 24]),
    { stiffness: 100, damping: 22 }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };



  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 sm:pt-28 pb-16 overflow-hidden bg-transparent select-none perspective-[1600px]"
    >
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 0.0s: CINEMATIC FILM GRAIN & AMBIENT TEXTURE OVERLAY             */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* LAYER 1: DEPTH = FAR (5-SECOND CROSSFADING HERO CAROUSEL)        */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          x: bgTranslateX,
          y: bgTranslateY,
          translateY: scrollBgY,
          scale: scrollBgScale,
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* 5-Slide Cinematic Crossfading Backdrops */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = activeSlide === index;
          return (
            <motion.div
              key={slide.src}
              initial={false}
              animate={{
                opacity: isLoaded && isActive ? 0.78 : 0,
                scale: isActive ? 1 : 1.06,
              }}
              transition={{
                opacity: { duration: 1.6, ease: cinematicEase },
                scale: { duration: 5.5, ease: "easeOut" },
              }}
              className="absolute inset-0 h-full w-full"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover object-center filter contrast-110 brightness-90"
              />
            </motion.div>
          );
        })}

        {/* Soft Non-Dividing Ambient Darkening & Radial Spotlights */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[850px] w-[850px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.1)_0%,transparent_70%)] blur-[150px]" />
      </motion.div>

      {/* Slide Progress Indicators (Bottom Right) */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-30 flex items-center gap-2 pointer-events-auto">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.src}
            onClick={() => setActiveSlide(idx)}
            className="group py-2 px-1 focus:outline-none cursor-pointer"
            title={slide.title}
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${activeSlide === idx
                  ? "w-7 bg-gradient-to-r from-amber-400 to-amber-200 shadow-lg shadow-amber-400/50"
                  : "w-2 bg-white/25 hover:bg-white/45"
                }`}
            />
          </button>
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 1.4s: SMALL DECORATIVE MICRO-ACCENTS (MARGIN DETAILS & COORDS)   */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* Left Margin: Studio Location & Est */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.9, delay: 1.4, ease: cinematicEase }}
        className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center gap-6 pointer-events-none"
      >
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
        <div className="flex flex-col items-center text-[10px] font-mono tracking-[0.3em] text-[#a3a4b2] uppercase space-y-1">
          <span className="text-[#c5a059] font-bold">EST.</span>
          <span>2020</span>
        </div>
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
      </motion.div>

      {/* Right Margin: Inking Mantra Tag */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.9, delay: 1.45, ease: cinematicEase }}
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center gap-6 pointer-events-none"
      >
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
        <div className="flex flex-col items-center gap-1.5 text-[9px] font-mono tracking-[0.35em] text-[#a3a4b2] uppercase text-center leading-tight">
          <span className="text-[#c5a059] font-bold">SACRED</span>
          <span>DEVOTION</span>
          <span>FOREVER</span>
        </div>
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
      </motion.div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* LAYER 3: FOREGROUND 3D EDITORIAL CONTENT (CENTERED & CLEAN)     */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          x: fgTranslateX,
          y: fgTranslateY,
          translateY: scrollTypeY,
          opacity: scrollTypeOpacity,
          scale: scrollTypeScale,
          transformStyle: "preserve-3d",
        }}
        className="container-hero relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl my-auto space-y-6 sm:space-y-8"
      >
        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 0.7s: SMALL EYEBROW TEXT (DROPS FROM ABOVE)                  */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -35, filter: "blur(8px)" }}
          animate={isLoaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.85, delay: 0.7, ease: cinematicEase }}
          className="space-y-1"
        >
          <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-amber-400 inline-block">
            TATTOO ARTIST
          </span>
          <p className="text-[11px] font-mono tracking-[0.2em] text-[#a3a4b2] uppercase">
            CUSTOM WORK · STUDIO + HOME SERVICE
          </p>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 0.9s: SYNCHRONIZED DYNAMIC HEADLINE & QUOTE (ANIMATES ON SLIDE) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.75, ease: cinematicEase }}
            className="flex flex-col items-center space-y-6 sm:space-y-7"
          >
            {/* Dynamic Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-[0.08em] sm:tracking-[0.14em] text-[#f5f2eb] drop-shadow-[0_10px_40px_rgba(0,0,0,0.98)] leading-[0.95] flex flex-col items-center">
              {/* Line 1 */}
              <span className="block overflow-hidden py-1">
                <span className="inline-block">
                  {HERO_SLIDES[activeSlide].line1}
                </span>
              </span>

              {/* Line 2 */}
              <span className="block overflow-hidden py-1">
                <span className="inline-block italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                  {HERO_SLIDES[activeSlide].line2}
                </span>
              </span>

              {/* Line 3 */}
              <span className="block overflow-hidden py-1">
                <span className="inline-block">
                  {HERO_SLIDES[activeSlide].line3}
                </span>
              </span>
            </h1>

            {/* Dynamic Quote & Style Badge */}
            <div className="max-w-2xl mx-auto space-y-2">
              <p className="text-base sm:text-lg md:text-xl text-white font-semibold leading-relaxed tracking-wide drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]">
                &ldquo;{HERO_SLIDES[activeSlide].quote}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-amber-300/90 font-mono tracking-[0.2em] uppercase font-bold">
                {HERO_SLIDES[activeSlide].styleBadge} Inked by <span className="text-white underline decoration-amber-500 underline-offset-4 font-bold">Jainik Patel</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>


      </motion.div>
    </div>
  );
}
