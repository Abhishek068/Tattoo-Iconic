"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Zap, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Spinner } from "@/components/ui";
import { useFlashDesign } from "@/hooks/useApi";
import { formatPrice, formatDate } from "@/lib/utils";

export function FlashDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { data: design, isLoading } = useFlashDesign(id);
  if (isLoading) return <><Navbar /><Spinner /><Footer /></>;
  if (!design) return <><Navbar /><div className="container-page py-20 text-center"><h1 className="text-2xl">Design not found</h1></div><Footer /></>;
  return (
    <><Navbar />
      <main className="container-page py-12">
        <Link href="/flash" className="btn-ghost text-sm mb-6 inline-flex items-center gap-1"><ArrowLeft size={16} /> All flash</Link>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-50 border border-ink-100"><Image src={design.image} alt={design.title} fill className="object-contain p-8" sizes="50vw" priority />
            {design.is_one_of_one && <span className="absolute top-4 right-4 badge bg-brand text-white text-sm px-3 py-1">One of one</span>}
          </div>
          <div>
            <h1 className="text-3xl">{design.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-500"><User size={14} /> By <Link href={`/artists/${design.artist_id}`} className="font-medium text-brand hover:underline">{design.artist_name}</Link></p>
            <p className="mt-6 text-4xl font-display text-brand">{formatPrice(design.price)}</p>
            <div className="mt-4 flex flex-wrap gap-2">{design.style_tags.map((t: string) => <span key={t} className="badge bg-brand/10 text-brand">{t}</span>)}</div>
            {design.description && <p className="mt-6 text-ink-600 leading-relaxed">{design.description}</p>}
            <div className="mt-8 space-y-3">
              {design.is_available ? (
                <button className="btn-primary w-full py-3 text-base"><Zap size={18} className="mr-2" /> Claim This Design</button>
              ) : (
                <div className="rounded-xl bg-ink-50 p-4 text-center"><p className="font-medium text-ink-600">This design has been claimed</p><p className="text-sm text-ink-400 mt-1">Check our other flash designs</p></div>
              )}
              <Link href="/booking" className="btn-secondary w-full">Book a custom piece instead</Link>
            </div>
            <p className="mt-4 text-xs text-ink-400">Added {formatDate(design.created_at)}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
