"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, ShieldCheck, Sparkles } from "lucide-react";
import { CLIENT_REVIEWS_3D, type Review3DItem } from "@/data/reviews3d";
import { MaskedHeading } from "@/components/ui/CinematicScroll";
import { MagneticElement, RollingText } from "@/components/ui/LusionEffects";

interface CinematicReviewReelProps {
  reviews?: Review3DItem[];
  heading?: string;
  subheading?: string;
  badge?: string;
  speed?: number; // pixels per second (~32-40px/s for slow cinematic 40s cycle)
  className?: string;
}

const ACCENTS = {
  gold: {
    border: "border-amber-500/30 group-hover:border-amber-400/70",
    glow: "rgba(216, 180, 103, 0.18)",
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/25",
    gradient: "from-amber-500/[0.09] via-[#0f1015] to-[#07080b]",
    quoteColor: "text-amber-400/35",
    starDrop: "rgba(245, 158, 11, 0.45)",
  },
  emerald: {
    border: "border-emerald-500/30 group-hover:border-emerald-400/70",
    glow: "rgba(16, 185, 129, 0.14)",
    badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
    gradient: "from-emerald-500/[0.08] via-[#0f1015] to-[#07080b]",
    quoteColor: "text-emerald-400/35",
    starDrop: "rgba(16, 185, 129, 0.4)",
  },
  sapphire: {
    border: "border-blue-500/30 group-hover:border-blue-400/70",
    glow: "rgba(59, 130, 246, 0.14)",
    badge: "text-blue-300 bg-blue-500/10 border-blue-500/25",
    gradient: "from-blue-500/[0.08] via-[#0f1015] to-[#07080b]",
    quoteColor: "text-blue-400/35",
    starDrop: "rgba(59, 130, 246, 0.4)",
  },
  bronze: {
    border: "border-orange-500/30 group-hover:border-orange-400/70",
    glow: "rgba(249, 115, 22, 0.14)",
    badge: "text-orange-300 bg-orange-500/10 border-orange-500/25",
    gradient: "from-orange-500/[0.08] via-[#0f1015] to-[#07080b]",
    quoteColor: "text-orange-400/35",
    starDrop: "rgba(249, 115, 22, 0.4)",
  },
  obsidian: {
    border: "border-white/20 group-hover:border-white/50",
    glow: "rgba(255, 255, 255, 0.10)",
    badge: "text-ink-200 bg-white/10 border-white/20",
    gradient: "from-white/[0.06] via-[#0f1015] to-[#07080b]",
    quoteColor: "text-white/25",
    starDrop: "rgba(255, 255, 255, 0.3)",
  },
};

export function CinematicReviewReel({
  reviews = CLIENT_REVIEWS_3D,
  heading = "WHAT OUR CLIENTS SAY",
  subheading = "5.0 ★ client ratings and healed tattoo accounts from collectors across Gujarat.",
  badge = "Client Stories & Reviews",
  speed = 35, // 35px/s = ~40-45s per full loop
  className = "",
}: CinematicReviewReelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Motion & Parallax refs
  const offsetRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse Parallax coordinates (-1 to +1)
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const bgGlowRef = useRef<HTMLDivElement | null>(null);

  // Pointer drag state
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  // Replicate 3 times for a seamless infinite loop
  const duplicatedReviews = useMemo(() => {
    return [...reviews, ...reviews, ...reviews];
  }, [reviews]);

  // Card geometry: compact dimensions
  // Desktop: ~330px width, ~210px height
  const cardWidth = 330;
  const cardGap = 28;
  const singleItemSpan = cardWidth + cardGap;
  const singleSetWidth = reviews.length * singleItemSpan;

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Mouse Move listener on window for subtle parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    mouseTargetRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
  }, [reducedMotion]);

  const handleMouseLeaveSection = useCallback(() => {
    setIsHovered(false);
    mouseTargetRef.current = { x: 0, y: 0 };
  }, []);

  // Real-time 3D transformation calculation per card
  const updateCardTransforms = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const cards = trackRef.current.children;

    // Smooth lerp mouse parallax
    mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.06;
    mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.06;

    // Ambient background parallax
    if (bgGlowRef.current) {
      const bgX = mouseCurrentRef.current.x * 30;
      const bgY = mouseCurrentRef.current.y * 18;
      bgGlowRef.current.style.transform = `translate3d(calc(-50% + ${bgX}px), calc(-50% + ${bgY}px), 0)`;
    }

    const parallaxX = mouseCurrentRef.current.x;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;

      // Distance normalized to container half-width (-1.6 to +1.6)
      const dist = (cardCenterX - containerCenterX) / (containerRect.width / 2);
      const absDist = Math.abs(dist);

      if (reducedMotion) {
        card.style.transform = "none";
        card.style.opacity = "1";
        card.style.filter = "none";
        continue;
      }

      // ── CINEMATIC 3D CURVE ──
      // Focus card (dist ~ 0): scale 1.12, translateZ(80px), opacity 1, rotateY 0, 0 blur
      // Middle side cards (dist ~ 0.5): scale 0.90, translateZ(-70px), opacity 0.65, rotateY ±10deg
      // Distant cards (dist > 0.9): scale 0.75, translateZ(-180px), opacity 0.35, rotateY ±15deg, blur(3px)

      let scale: number;
      let translateZ: number;
      let opacity: number;
      let blur: number;
      let rotateY: number;
      let translateY: number;

      if (absDist <= 0.35) {
        // FOCUS ZONE
        const t = absDist / 0.35; // 0 to 1
        scale = 1.12 - t * 0.16; // 1.12 -> 0.96
        translateZ = 80 - t * 120; // 80px -> -40px
        opacity = 1.0 - t * 0.25; // 1.0 -> 0.75
        blur = 0;
        rotateY = dist * -10 + parallaxX * 3; // subtle tilt toward center
        translateY = t * 4;
      } else {
        // DISTANT ZONE
        const t = Math.min(1.5, (absDist - 0.35) / 0.75); // 0 to 1.5
        scale = Math.max(0.72, 0.96 - t * 0.22); // 0.96 -> 0.74
        translateZ = Math.max(-190, -40 - t * 130); // -40px -> -170px
        opacity = Math.max(0.28, 0.75 - t * 0.42); // 0.75 -> 0.33
        blur = Math.min(4.5, Math.max(0, (absDist - 0.6) * 3.5));
        rotateY = Math.max(-18, Math.min(18, dist * -13 + parallaxX * 1.5));
        translateY = 4 + t * 6;
      }

      // Parallax micro-shift: center card shifts slightly more than background cards
      const cardParallaxOffset = (1 - Math.min(1, absDist)) * parallaxX * 10;

      card.style.transform = `translate3d(${cardParallaxOffset}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = `${opacity}`;
      card.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
      card.style.zIndex = `${Math.round((1 - Math.min(1, absDist)) * 60) + 10}`;
    }
  }, [reducedMotion]);

  // Main animation loop
  useEffect(() => {
    if (reducedMotion) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Auto-scroll continuously if not hovered and not dragging
      if (!isHovered && !isDragging) {
        offsetRef.current += speed * deltaTime;

        // Infinite loop seamless modulo wrap without any visible jump
        if (singleSetWidth > 0) {
          if (offsetRef.current >= singleSetWidth) {
            offsetRef.current = offsetRef.current % singleSetWidth;
          } else if (offsetRef.current < 0) {
            offsetRef.current = singleSetWidth + (offsetRef.current % singleSetWidth);
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }

      // Always update 3D spatial transforms and mouse parallax
      updateCardTransforms();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isHovered, isDragging, speed, singleSetWidth, reducedMotion, updateCardTransforms]);

  // Pointer / Mouse Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;

    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || reducedMotion) return;
    const currentX = e.clientX;
    const deltaX = currentX - dragStartXRef.current;

    let newOffset = dragStartOffsetRef.current - deltaX;
    if (singleSetWidth > 0) {
      if (newOffset >= singleSetWidth) {
        newOffset = newOffset % singleSetWidth;
        dragStartOffsetRef.current = newOffset + deltaX;
      } else if (newOffset < 0) {
        newOffset = singleSetWidth + (newOffset % singleSetWidth);
        dragStartOffsetRef.current = newOffset + deltaX;
      }
    }

    offsetRef.current = newOffset;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${newOffset}px, 0, 0)`;
    }
    updateCardTransforms();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
    lastTimeRef.current = performance.now();
  };

  return (
    <section
      className={`relative w-full py-24 sm:py-32 overflow-hidden bg-[#060709] text-[#f5f2eb] select-none ${className}`}
      aria-label="Client Reviews and Verified Testimonials"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeaveSection}
    >
      {/* ── Atmospheric Cinematic Environment (Parallax Radial Lighting) ── */}
      <div
        ref={bgGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[850px] rounded-full bg-amber-500/[0.05] blur-[150px] pointer-events-none transition-transform duration-300 ease-out will-change-transform"
      />
      <div className="absolute top-10 right-1/4 h-64 w-64 rounded-full bg-amber-400/[0.02] blur-[100px] pointer-events-none" />

      {/* ── Top Header & Narrative ── */}
      <div className="container-hero relative z-10 mb-14 sm:mb-18">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 backdrop-blur-md">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-bold">
                {badge}
              </span>
            </div>

            <MaskedHeading>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f2eb] font-bold uppercase tracking-tight">
                {heading}
              </h2>
            </MaskedHeading>

            <p className="text-sm sm:text-base text-[#9ea0b2] font-light leading-relaxed">
              {subheading}
            </p>
          </div>

          {/* Aggregate Rating Badge */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-[#0c0d12]/80 backdrop-blur-xl shadow-lg shadow-black/40">
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="h-4 w-px bg-white/15" />
              <span className="text-xs font-bold text-white tracking-wider">5.0 / 5.0 Rating</span>
            </div>

            <MagneticElement strength={0.3}>
              <Link
                href="/reviews"
                className="btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] group inline-block"
              >
                <RollingText text="ALL REVIEWS" />
              </Link>
            </MagneticElement>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D CINEMATIC REEL STAGE                                                   */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden py-12 cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 6%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.85) 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 6%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.85) 94%, transparent 100%)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Continuous 3D Moving Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-7 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            touchAction: "pan-y",
          }}
        >
          {duplicatedReviews.map((rev, index) => {
            const styleAccent = rev.styleAccent || "gold";
            const theme = ACCENTS[styleAccent] || ACCENTS.gold;
            const initials = rev.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={`${rev.id}-${index}`}
                className="w-[270px] sm:w-[310px] md:w-[330px] shrink-0 transition-all duration-500 ease-out will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* ── Compact Luxury Card (Height: ~190px - 220px) ── */}
                <div
                  className={`group relative h-full min-h-[195px] max-h-[225px] rounded-2xl border bg-gradient-to-br ${theme.gradient} p-5 sm:p-5.5 shadow-2xl backdrop-blur-2xl transition-all duration-400 ease-out flex flex-col justify-between overflow-hidden hover:brightness-110 hover:border-amber-400/80 hover:shadow-amber-500/20 ${theme.border}`}
                  style={{
                    boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 25px ${theme.glow}`,
                  }}
                >
                  {/* Subtle Background Radial Aura */}
                  <div
                    className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-75"
                    style={{ backgroundColor: theme.glow }}
                  />

                  {/* ── TOP: Rating Stars & Quote Icon ── */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          size={13}
                          fill="currentColor"
                          className="drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {rev.verified && (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border ${theme.badge}`}
                        >
                          <ShieldCheck size={10} className="text-emerald-400" />
                          <span>Verified</span>
                        </span>
                      )}
                      <Quote size={15} className={`${theme.quoteColor} shrink-0`} />
                    </div>
                  </div>

                  {/* ── MIDDLE: Short Review Quotation ── */}
                  <div className="relative z-10 my-1">
                    <p className="text-xs sm:text-[13px] text-[#e0e2ec] font-light leading-snug italic line-clamp-3">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>

                  {/* ── BOTTOM: Client Avatar, Name & Piece Tag ── */}
                  <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center gap-2.5">
                    {/* Small 32px Avatar / Monogram */}
                    <div className="relative w-8 h-8 rounded-full border border-amber-500/30 bg-[#12141c] overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                      {rev.avatar && !rev.avatar.includes("avatar-") ? (
                        <Image
                          src={rev.avatar}
                          alt={rev.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <span className="font-serif text-[11px] font-bold text-amber-300 tracking-wider">
                          {initials}
                        </span>
                      )}
                    </div>

                    {/* Name, Tattoo Piece & City */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-xs sm:text-[13px] font-bold text-white tracking-wide truncate">
                        {rev.name}
                      </h3>
                      <p className="text-[10px] text-[#8e90a0] truncate">
                        {rev.tattooPiece || "Custom Tattoo Piece"}
                        {rev.location ? ` · ${rev.location.split(",")[0]}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
