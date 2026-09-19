"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Instagram, Clock, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Spinner, Avatar, StarRating } from "@/components/ui";
import { useArtist, usePortfolio, useReviews } from "@/hooks/useApi";
import { formatPrice, timeAgo } from "@/lib/utils";

export function ArtistDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading } = useArtist(id);
  const { data: portfolio } = usePortfolio({ artist_id: id });
  const { data: reviews } = useReviews(id);
  const pieces = portfolio?.results ?? [];
  const allReviews = reviews?.results ?? [];
  const avgRating = allReviews.length ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1) : null;

  if (isLoading) return <><Navbar /><Spinner /><Footer /></>;
  if (!artist) return <><Navbar /><div className="container-page py-20 text-center"><h1 className="text-2xl">Artist not found</h1></div><Footer /></>;

  return (
    <><Navbar />
      <main className="container-page py-12">
        <Link href="/artists" className="btn-ghost text-sm mb-6 inline-flex items-center gap-1"><ArrowLeft size={16} /> All artists</Link>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-center">
                <Avatar src={artist.profile_image} name={artist.full_name} size="lg" />
                <h1 className="mt-4 text-2xl font-display">{artist.full_name}</h1>
                {avgRating && <div className="mt-2 flex items-center justify-center gap-1.5"><Star size={14} className="text-yellow-500 fill-yellow-500" /><span className="text-sm font-medium">{avgRating}</span><span className="text-xs text-ink-400">({allReviews.length} reviews)</span></div>}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {artist.specialties.map((s: string) => <span key={s} className="badge bg-brand/10 text-brand">{s}</span>)}
              </div>
              <p className="mt-5 text-sm text-ink-600 leading-relaxed">{artist.bio}</p>
              <div className="mt-5 space-y-2 text-sm text-ink-500 border-t border-ink-100 pt-5">
                <div className="flex justify-between"><span>Experience</span><span className="font-medium text-ink-900">{artist.experience_years || artist.years_of_experience || 10} years</span></div>
                {artist.hourly_rate && <div className="flex justify-between"><span>Hourly rate</span><span className="font-medium text-ink-900">{formatPrice(artist.hourly_rate)}</span></div>}
                <div className="flex justify-between"><span>Min deposit</span><span className="font-medium text-ink-900">{formatPrice(artist.minimum_deposit)}</span></div>
                <div className="flex justify-between"><span>Lead time</span><span className="font-medium text-ink-900">{artist.booking_lead_days} days</span></div>
              </div>
              {artist.instagram_handle && (
                <a href={`https://instagram.com/${artist.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-500 hover:text-brand">
                  <Instagram size={16} /> @{artist.instagram_handle}
                </a>
              )}
              {artist.is_accepting_bookings && <Link href="/booking" className="btn-primary w-full mt-5">Book with {artist.full_name.split(" ")[0]}</Link>}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xl font-display mb-6">Portfolio ({pieces.length})</h2>
              {pieces.length === 0 ? <p className="text-sm text-ink-400">No pieces uploaded yet.</p> : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pieces.map((p) => (
                    <Link key={p.id} href={`/portfolio/${p.id}`} className="group relative aspect-square overflow-hidden rounded-xl bg-ink-100">
                      <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
            {allReviews.length > 0 && (
              <section>
                <h2 className="text-xl font-display mb-6">Reviews ({allReviews.length})</h2>
                <div className="space-y-4">
                  {allReviews.map((r) => (
                    <div key={r.id} className="card">
                      <div className="flex items-center justify-between">
                        <StarRating rating={r.rating} size={14} />
                        <span className="text-xs text-ink-400">{timeAgo(r.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm text-ink-600">{r.comment}</p>
                      <p className="mt-2 text-xs font-medium text-ink-500">{r.client_name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
