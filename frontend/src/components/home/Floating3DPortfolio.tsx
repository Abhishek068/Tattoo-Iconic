"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/constants";
import type { PortfolioItem } from "@/types";
import { LusionSpotlightCard, MagneticElement, RollingText } from "@/components/ui/LusionEffects";

export function Floating3DPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePiece, setActivePiece] = useState<PortfolioItem | null>(null);

  // Mouse tilt physics for the 3D gallery
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 100, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
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
      className="relative w-full py-24 sm:py-32 overflow-hidden perspective-[1400px]"
    >
      <div className="container-hero relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 mb-14">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-bold uppercase">
              FEATURED INKS
            </h2>
            <p className="text-xs sm:text-sm text-[#a3a4b2] mt-1 max-w-xl">
              Floating in spatial depth. Move your cursor to interact with perspective layers; click any piece for high-resolution inspection.
            </p>
          </div>

          <MagneticElement strength={0.3}>
            <Link
              href="/portfolio"
              className="btn-gold px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] self-start md:self-end group inline-block"
            >
              <RollingText text="VIEW FULL PORTFOLIO (18+)" />
            </Link>
          </MagneticElement>
        </div>

        {/* 3D Interactive Floating Canvas Grid - Compact Picture Grid with Lusion Holographic Spotlight */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 transition-transform duration-300"
        >
          {PORTFOLIO_ITEMS.slice(0, 8).map((item, idx) => {
            // Staggered physical depth offsets
            const depthTranslateZ = idx % 2 === 0 ? "translateZ(15px)" : "translateZ(30px)";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (idx % 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{ transform: depthTranslateZ }}
              >
                <LusionSpotlightCard
                  onClick={() => setActivePiece(item)}
                  tiltStrength={6}
                  className="cursor-pointer aspect-square rounded-2xl border border-white/[0.12] bg-[#121319] shadow-xl transition-all duration-500 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-black"
                >
                  {/* Artwork Photography */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 filter brightness-95 group-hover:brightness-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </LusionSpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Cinematic Modal Lightbox */}
      <AnimatePresence>
        {activePiece && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/92 backdrop-blur-2xl"
            onClick={() => setActivePiece(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl border border-amber-500/30 bg-[#0d0e12] p-6 sm:p-8 shadow-2xl grid md:grid-cols-2 gap-6 overflow-hidden"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/10">
                <Image src={activePiece.image} alt={activePiece.title} fill className="object-cover" />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 uppercase">
                      {activePiece.primary_style}
                    </span>
                    <button
                      onClick={() => setActivePiece(null)}
                      className="rounded-full bg-white/10 p-2 text-[#cacad3] hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold uppercase mt-4">
                    {activePiece.title}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold mt-1">
                    Placement: {activePiece.placement} · {activePiece.session_hours ? `${activePiece.session_hours} hrs session` : "Custom"}
                  </p>

                  <p className="text-sm text-[#cacad3] mt-3 leading-relaxed">
                    {activePiece.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {activePiece.style_tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#a3a4b2]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link
                    href={`/booking?style=${encodeURIComponent(activePiece.primary_style)}`}
                    className="btn-gold flex-1 text-center text-xs font-bold uppercase py-3.5"
                  >
                    Book Similar Tattoo
                  </Link>
                  <button
                    onClick={() => setActivePiece(null)}
                    className="btn-secondary text-xs uppercase font-bold py-3.5 px-5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
