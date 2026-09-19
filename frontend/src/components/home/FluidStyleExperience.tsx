"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LusionSpotlightCard, MagneticElement, RollingText } from "@/components/ui/LusionEffects";

const STYLES_DATA = [
  {
    id: "black-grey",
    name: "BLACK & GREY",
    subtitle: "Chiaroscuro & Velvety Tonal Depth",
    description:
      "Deep saturated charcoal blacks and feather-light stippling gradients that maintain permanent contrast across decades of healing.",
    image: "/images/tattoos/rose-clock-tattoo.jpg",
    specs: "Magnum Shader & 3RL · Reach Vegan Inks · Volumetric Light",
  },
  {
    id: "realism",
    name: "DARK REALISM",
    subtitle: "Hyper-Detailed Portraiture & Wildlife",
    description:
      "Three-dimensional realism capturing piercing eyes, fur textures, and imperial portraits contoured to the human anatomy.",
    image: "/images/tattoos/lion-king-tattoo.jpg",
    specs: "Layered Shading · Anatomical Muscle Flow · Micro-Textures",
  },
  {
    id: "fine-line",
    name: "FINE LINE",
    subtitle: "Whisper-Thin Architectural Precision",
    description:
      "Ultra-crisp 0.25mm single-needle botanical studies and delicate script that feels like fine pencil sketches on living skin.",
    image: "/images/tattoos/lotus-mandala-tattoo.jpg",
    specs: "Single-Needle · Minimal Skin Trauma · Rapid Healing",
  },
  {
    id: "spiritual",
    name: "SACRED & DEVOTIONAL",
    tagline: "Divine energy and cosmic mandalas",
    subtitle: "Lord Shiva, Hanuman Ji & Sacred Mantras",
    description:
      "Spiritual iconography capturing reverence, golden saffron tilaks, and cosmic geometry aligned with the wearer's life path.",
    image: "/images/tattoos/hanuman-tattoo.png",
    specs: "Dotwork Mandala · Saffron Pigments · Sacred Devotion",
  },
  {
    id: "custom",
    name: "CUSTOM BESPOKE",
    subtitle: "One-of-a-Kind Narrative Heirloom",
    description:
      "An intimate collaboration where your memories, personal milestones, or philosophical journeys are drafted into a completely unique piece.",
    image: "/images/tattoos/radha-krishna-tattoo.jpg",
    specs: "1-on-1 Consultation · Anatomical Drafting · Never Repeated",
  },
];

export function FluidStyleExperience() {
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);
  const activeStyle = STYLES_DATA[activeStyleIdx];

  return (
    <div className="relative w-full py-24 sm:py-32 overflow-hidden">
      <div className="container-hero relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold">
            Interactive Style Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-bold uppercase">
            TATTOO DISCIPLINES
          </h2>
          <p className="text-xs sm:text-sm text-[#a3a4b2]">
            Select an aesthetic to trigger fluid artwork dissolution and discover technical craft specifications.
          </p>
        </div>

        {/* Dual Fluid Layout: Left Style Navigation & Right Dissolving Canvas */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Style Navigation Bar with Separate Staggered Fly-in Animations */}
          <div className="lg:col-span-5 space-y-3.5 perspective-[1000px]">
            {STYLES_DATA.map((style, idx) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, x: -80, y: 25, rotateY: 12, scale: 0.94, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.85,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  onClick={() => setActiveStyleIdx(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 flex items-center justify-between cursor-pointer group ${
                    activeStyleIdx === idx
                      ? "bg-gradient-to-r from-amber-500/20 via-white/[0.04] to-transparent border-amber-400 text-white shadow-xl shadow-amber-500/10 scale-[1.02]"
                      : "border-white/10 bg-[#0d0e12]/90 text-[#cacad3] hover:border-amber-400/40 hover:bg-white/[0.04] hover:text-white hover:translate-x-1"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 block mb-0.5 uppercase tracking-widest font-bold">
                      0{idx + 1}
                    </span>
                    <h3 className="font-serif text-lg font-bold uppercase tracking-wide group-hover:text-amber-200 transition-colors">
                      {style.name}
                    </h3>
                    <p className="text-xs text-[#a3a4b2] mt-0.5 line-clamp-1 font-light">{style.subtitle}</p>
                  </div>
                  <div
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      activeStyleIdx === idx
                        ? "border-amber-400 bg-amber-400/20 text-amber-300"
                        : "border-white/10 text-white/30 group-hover:border-white/30 group-hover:text-white"
                    }`}
                  >
                    <ArrowRight
                      size={15}
                      className={`transition-transform duration-300 ${
                        activeStyleIdx === idx ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Dissolving Fluid Preview Canvas with Lusion Spotlight */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStyle.id}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <LusionSpotlightCard
                  tiltStrength={6}
                  className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-amber-500/30 bg-[#121319] shadow-2xl p-6 sm:p-10 flex flex-col justify-end group"
                >
                  {/* Background Artwork */}
                  <Image
                    src={activeStyle.image}
                    alt={activeStyle.name}
                    fill
                    className="object-cover filter contrast-110 brightness-[0.72] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/50 to-transparent pointer-events-none" />

                  {/* Content Overlay */}
                  <div className="relative z-10 space-y-2.5 max-w-xl">
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 inline-block">
                      {activeStyle.specs}
                    </span>
                    <h4 className="font-serif text-2xl sm:text-4xl font-bold text-white uppercase">
                      {activeStyle.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#cacad3] leading-relaxed">
                      {activeStyle.description}
                    </p>
                    <div className="pt-2">
                      <MagneticElement strength={0.3}>
                        <Link
                          href={`/booking?style=${encodeURIComponent(activeStyle.name)}`}
                          className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] inline-flex items-center gap-2 group"
                        >
                          <RollingText text="Commission This Style" />
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-amber-300" />
                        </Link>
                      </MagneticElement>
                    </div>
                  </div>
                </LusionSpotlightCard>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
