"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface CardData {
  id: string;
  step: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  statNumber: string;
  statLabel: string;
}

const STACK_CARDS: CardData[] = [
  {
    id: "fine-line-realism",
    step: "01 / MASTERY",
    category: "Signature Inking Technique",
    title: "Micro-Fine Line & Dark Realism",
    subtitle: "Precision linework contoured organically to human anatomy",
    description:
      "Every piece is an anatomical masterpiece. Jainik Patel uses single-needle and 3-round liner techniques with surgical precision to create ultra-crisp portraits, delicate florals, and high-contrast dark realism tattoos that age flawlessly.",
    highlights: [
      "Single-needle stipple shading & micro-textures",
      "Dynamic anatomical contour fitting",
      "Heavy-metal-free organic vegan inks",
      "7,000+ custom tattoos completed over 10+ years",
    ],
    image:
      "https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1200&q=85",
    badge: "Master Specialty",
    ctaText: "Explore Style Gallery",
    ctaLink: "/portfolio?style=Realism",
    statNumber: "10+ Yrs",
    statLabel: "Artistic Mastery",
  },
  {
    id: "private-studio",
    step: "02 / ATELIER",
    category: "Private Suite Experience",
    title: "Tranquil Bhadam Studio Suite",
    subtitle: "Exclusive 1-on-1 private appointment with zero distractions",
    description:
      "Located in Bhadam, Rajpipla, our private studio is designed for complete focus and relaxation. Enjoy ergonomic hydraulic seating, ambient acoustics, personalized music, and hospital-grade sterilization with medical vacuum autoclaves.",
    highlights: [
      "Strictly 1-on-1 private studio environment",
      "Daily tested Class-B vacuum autoclave logs",
      "Single-use surgical cartridges opened before you",
      "Ergonomic memory-foam studio setup",
    ],
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85",
    badge: "Private Atelier",
    ctaText: "Book Studio Visit",
    ctaLink: "/booking?service=studio_visit",
    statNumber: "100%",
    statLabel: "Sterility Standard",
  },
  {
    id: "home-service",
    step: "03 / VIP LUXURY",
    category: "Mobile Inking Protocol",
    title: "Luxury At-Your-Home Service",
    subtitle: "Hospital-grade tattoo studio brought straight to your residence",
    description:
      "For clients seeking utmost privacy, comfort, and luxury, Jainik travels with a complete portable sterile tattoo suite directly to your home across Rajpipla, Narmada, and surrounding regions in Gujarat.",
    highlights: [
      "Complete mobile sanitized workstation setup",
      "Maximum comfort & zero travel stress",
      "Complete discretion & VIP confidentiality",
      "Full aftercare kit and immediate healing guidance",
    ],
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=85",
    badge: "At-Home Service",
    ctaText: "Request Home Inking",
    ctaLink: "/booking?service=home_service",
    statNumber: "Gujarat",
    statLabel: "Mobile Coverage",
  },
  {
    id: "custom-design",
    step: "04 / PROCESS",
    category: "Bespoke Artwork Consultation",
    title: "1-on-1 Concept & 3D Stencil Preview",
    subtitle: "Turn personal stories, mythology & references into original body art",
    description:
      "No generic flash wall tattoos. Jainik sketches custom compositions tailored to your body's muscle flow and skin tone. View placement sizing digitally before a single needle touch.",
    highlights: [
      "Dedicated 1-on-1 concept discovery session",
      "Anatomical muscle-flow digital preview",
      "Scale & contrast skin tone matching",
      "Unlimited initial concept revisions",
    ],
    image:
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=85",
    badge: "Bespoke Design",
    ctaText: "Start Custom Design",
    ctaLink: "/booking?service=consultation",
    statNumber: "100%",
    statLabel: "Original Art",
  },
  {
    id: "aftercare-guarantee",
    step: "05 / PROTOCOL",
    category: "Clinical Healing & Longevity",
    title: "Second-Skin Dressing & Touchup Care",
    subtitle: "Medical-grade hypoallergenic healing protocol included with every piece",
    description:
      "Your session concludes with breathable medical polyurethane dressing, vegan soothing balm, and detailed aftercare instructions. Complimentary touchup guarantee ensures lifetime vibrancy.",
    highlights: [
      "Medical-grade waterproof second-skin dressing",
      "Organic soothing aftercare kit included",
      "Step-by-step 21-day WhatsApp healing support",
      "Complimentary lifetime touchup guarantee",
    ],
    image:
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1200&q=85",
    badge: "Healing Protocol",
    ctaText: "View Aftercare Guide",
    ctaLink: "/about",
    statNumber: "99.9%",
    statLabel: "Healed Rate",
  },
];

export function ScrollStackCards() {
  return (
    <section className="relative w-full py-16 sm:py-20">
      {/* Background Ambient Glows */}
      <div className="accent-glow top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-brand/10 pointer-events-none" />

      <div className="container-page relative z-10 mb-12 text-center max-w-3xl mx-auto space-y-3">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          Scroll to Unfold the <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent italic">
            Tattoo Iconic Experience
          </span>
        </h2>

        <p className="text-base text-ink-300 leading-relaxed max-w-xl mx-auto">
          Explore our signature craft, private Bhadam atelier, luxury mobile home service, and custom design process as each card smoothly unfolds on scroll.
        </p>
      </div>

      {/* Seamless Sticky Stacking Cards with Zero Empty Gap */}
      <div className="container-page relative space-y-8 sm:space-y-12">
        {STACK_CARDS.map((card, idx) => {
          const topStickyOffset = 90 + idx * 14; // Stacks smoothly with 14px cascading header tier

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                top: `${topStickyOffset}px`,
              }}
              className="sticky w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-ink-900/95 via-surface-dark/95 to-ink-950/98 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:shadow-amber-500/10"
            >
              {/* Subtle Warm Ambient Glow */}
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                {/* Left Column: Story Details & Badges */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-amber-400">
                      {card.step}
                    </span>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-1">
                      {card.category}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-amber-200/90 mt-1">
                      {card.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Highlights List */}
                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    {card.highlights.map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 p-2.5"
                      >
                        <CheckCircle2
                          size={15}
                          className="mt-0.5 text-amber-400 shrink-0"
                        />
                        <span className="text-xs text-ink-200 font-medium">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Row & Stat Metric */}
                  <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                    <Link
                      href={card.ctaLink}
                      className="btn-primary py-2.5 sm:py-3 px-5 sm:px-6 text-xs sm:text-sm flex items-center gap-2 group shadow-xl shadow-brand/20"
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>

                    <div className="text-right">
                      <span className="font-display text-xl font-bold text-white block">
                        {card.statNumber}
                      </span>
                      <span className="text-[11px] text-ink-400 font-medium">
                        {card.statLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Artwork Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/15 bg-ink-950 shadow-2xl group/img">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl border border-white/15 bg-ink-950/85 backdrop-blur-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        Tattoo Iconic Signature
                      </span>
                      <span className="text-[11px] font-bold text-amber-300">
                        Jainik Patel
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
