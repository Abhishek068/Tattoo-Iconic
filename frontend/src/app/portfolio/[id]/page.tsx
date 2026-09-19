"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { portfolioService } from "@/services/portfolioService";
import type { PortfolioItem } from "@/types";
import { capitalize } from "@/lib/utils";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [related, setRelated] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const piece = await portfolioService.getPortfolioItem(id);
      setItem(piece);
      if (piece) {
        const all = await portfolioService.getPortfolio({ style: piece.primary_style });
        setRelated(all.filter((p) => p.id !== piece.id).slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-page py-24 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-brand mx-auto" />
        </div>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <div className="container-page py-24 text-center">
          <h1 className="font-display text-3xl text-white">Piece Not Found</h1>
          <p className="text-sm text-ink-400 mt-2">The requested artwork could not be located.</p>
          <Link href="/portfolio" className="btn-primary mt-6 text-sm">
            Back to Portfolio
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container-page py-12 sm:py-16">
        <Link
          href="/portfolio"
          className="btn-ghost text-xs sm:text-sm mb-6 inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Portfolio Archive
        </Link>

        {/* Top Split Details */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Main Visual Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-ink-900 shadow-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 60vw"
              />
            </div>

            {item.healed_image && (
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-ink-900">
                <Image
                  src={item.healed_image}
                  alt={`${item.title} — Healed result`}
                  fill
                  className="object-cover"
                  sizes="60vw"
                />
                <span className="absolute top-4 left-4 badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fully Healed Proof
                </span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 space-y-6">
            <div>
              <span className="rounded-full bg-brand/20 border border-brand/40 px-3 py-1 text-xs font-semibold text-brand-light">
                Jainik Patel Original
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mt-3">
                {item.title}
              </h1>
              <p className="text-xs text-amber-300 font-medium mt-1">
                {item.placement} · {item.primary_style}
              </p>
            </div>

            {/* Style Tags */}
            <div className="flex flex-wrap gap-2">
              {item.style_tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-amber-200"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Specifications Matrix */}
            <div className="space-y-3 text-xs sm:text-sm text-ink-300 border-y border-white/10 py-4">
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Master Artist</span>
                <span className="font-semibold text-white">Jainik Patel</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Body Placement</span>
                <span className="font-semibold text-white">{capitalize(item.placement)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Color Palette</span>
                <span className="font-semibold text-white">{item.color_type}</span>
              </div>
              {item.size && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Approximate Scale</span>
                  <span className="font-semibold text-white">{item.size}</span>
                </div>
              )}
              {item.session_hours && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-400">Session Duration</span>
                  <span className="font-semibold text-amber-300">{item.session_hours} Hours</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Originality</span>
                <span className="font-semibold text-emerald-400">100% Unique (Never Duplicated)</span>
              </div>
            </div>

            {/* Narrative & Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Composition Story
              </h3>
              <p className="text-xs sm:text-sm text-ink-200 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-2 space-y-3">
              <Link
                href={`/booking?style=${encodeURIComponent(
                  item.primary_style
                )}&placement=${encodeURIComponent(item.placement)}`}
                className="btn-primary w-full text-center py-3.5 text-sm font-semibold"
              >
                <Calendar size={16} className="mr-2" />
                <span>Interested in Something Similar? Book a Consultation</span>
              </Link>
              <Link
                href="/portfolio"
                className="btn-secondary w-full text-center py-3 text-xs sm:text-sm"
              >
                Browse Other Styles
              </Link>
            </div>
          </div>
        </div>

        {/* Related Artworks */}
        {related.length > 0 && (
          <section className="mt-20 pt-10 space-y-6">
            <h2 className="font-display text-2xl text-white">
              Related {item.primary_style} Tattoos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/portfolio/${rel.id}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 shadow-lg block"
                >
                  <Image
                    src={rel.image}
                    alt={rel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-display text-sm font-bold text-white">{rel.title}</p>
                    <p className="text-xs text-amber-300">{rel.placement}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
