"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader, FilterChip, Skeleton, EmptyState } from "@/components/ui";
import { useFlashDesigns } from "@/hooks/useApi";
import { formatPrice } from "@/lib/utils";
import { TATTOO_STYLES } from "@/constants";

export default function FlashPage() {
  const [style, setStyle] = useState("All");
  const params: Record<string, string> = {};
  if (style !== "All") params.style_tags = style.toLowerCase();
  const { data, isLoading } = useFlashDesigns(params);
  const designs = data?.results ?? [];
  return (
    <><Navbar />
      <main className="container-page py-12">
        <PageHeader title="Flash Designs" description="Pre-drawn designs ready to be tattooed. Claim yours before someone else does." />
        <div className="mt-8 flex flex-wrap gap-2">{TATTOO_STYLES.map((s) => <FilterChip key={s} label={s} active={style === s} onClick={() => setStyle(s)} />)}</div>
        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}</div>
        ) : designs.length === 0 ? (
          <EmptyState icon={<Zap size={48} />} title="No flash designs available" description="Check back soon — our artists add new designs regularly." />
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/flash/${d.id}`} className="card p-0 overflow-hidden group block">
                  <div className="relative aspect-square bg-ink-50"><Image src={d.image} alt={d.title} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    {d.is_one_of_one && <span className="absolute top-3 right-3 badge bg-brand text-white">One of one</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base group-hover:text-brand transition-colors">{d.title}</h3>
                    <p className="text-sm text-ink-500 mt-0.5">{d.artist_name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-display text-brand">{formatPrice(d.price)}</span>
                      <div className="flex gap-1">{d.style_tags.slice(0, 2).map((t: string) => <span key={t} className="badge bg-ink-50 text-ink-500 text-xs">{t}</span>)}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
