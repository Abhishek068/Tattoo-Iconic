"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

// Apple & Awwwards-standard luxury smooth easing
export const smoothEase = [0.22, 1, 0.36, 1];

// ── 1. Top Hairline Golden Scroll Progress Bar ──
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 z-[100] pointer-events-none"
    />
  );
}

// ── 2. Minimalist Floating Chapter Indicator ──
export function ScrollChapterNav({
  activeSection,
  sections,
}: {
  activeSection: string;
  sections: { id: string; label: string; num: string }[];
}) {
  return (
    <aside
      aria-label="Story Chapters"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col gap-3 pointer-events-auto"
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="group flex items-center justify-end gap-2.5 text-right transition-all duration-300"
          >
            <span
              className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                isActive ? "opacity-100 text-amber-300 font-bold" : "text-[#747688]"
              }`}
            >
              {sec.label}
            </span>
            <span
              className={`h-1.5 rounded-full transition-all duration-400 ${
                isActive
                  ? "w-6 bg-gradient-to-r from-amber-500 to-amber-300"
                  : "w-1.5 bg-white/20 group-hover:bg-white/50"
              }`}
            />
          </a>
        );
      })}
    </aside>
  );
}

// ── 3. Masked Editorial Typography Line Reveal ──
export function MaskedHeading({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{ duration: 0.85, delay, ease: smoothEase }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── 4. Masked Cinematic Image Reveal with Curtain Slide ──
export function MaskedImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.15, opacity: 0 }}
        transition={{ duration: 1.1, delay, ease: smoothEase }}
        className="h-full w-full"
      >
        {children}
      </motion.div>

      {/* Cinematic unveil curtain */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.85, delay: delay + 0.1, ease: smoothEase }}
        style={{ transformOrigin: "top" }}
        className="absolute inset-0 bg-[#090a0d] z-10 pointer-events-none"
      />
    </div>
  );
}

// ── 5. Parallax Wrapper ──
export function ParallaxLayer({
  children,
  offset = 40,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// ── 6. Section Container Reveal ──
export function SectionReveal({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id={id}
      className={`relative py-12 sm:py-16 lg:py-20 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
        transition={{ duration: 0.85, ease: smoothEase }}
      >
        {children}
      </motion.div>
    </section>
  );
}
