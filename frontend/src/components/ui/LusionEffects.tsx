"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

// ── 1. LUSION MAGNETIC BUTTON / LINK WITH ELASTIC SPRING PULL ──
export function MagneticElement({
  children,
  className = "",
  strength = 0.35,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={`inline-block cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── 2. LUSION KINETIC CHARACTER ROLLER (ON HOVER CHARACTER SWAP) ──
export function RollingText({
  text,
  className = "",
  active = false,
}: {
  text: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <span className={`relative inline-flex overflow-hidden leading-none ${className}`}>
      <span className="inline-flex">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 inline-flex" aria-hidden="true">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${
              active ? "text-amber-300" : "text-[#f5f2eb]"
            }`}
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

// ── 3. LUSION 3D HOLOGRAPHIC SPOTLIGHT CARD ──
export function LusionSpotlightCard({
  children,
  className = "",
  onClick,
  tiltStrength = 8,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltStrength?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50, opacity: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltStrength, -tiltStrength]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltStrength, tiltStrength]), {
    stiffness: 120,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    const normX = xPos / rect.width - 0.5;
    const normY = yPos / rect.height - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);

    setSpotlightPos({
      x: (xPos / rect.width) * 100,
      y: (yPos / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden group perspective-[1000px] ${className}`}
    >
      {/* Specular Interactive Holographic Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-500"
        style={{
          opacity: spotlightPos.opacity,
          background: `radial-gradient(circle 280px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(212, 175, 55, 0.22), rgba(255, 255, 255, 0.08) 30%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ── 4. LUSION KINETIC SPLIT HEADING WITH STAGGERED WORD CASCADE ──
export function KineticHeading({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={`inline-flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="relative inline-block overflow-hidden py-0.5">
          <motion.span
            initial={{ y: "115%", opacity: 0, rotate: 3 }}
            whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.85,
              delay: delay + wordIndex * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block transform-gpu"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
