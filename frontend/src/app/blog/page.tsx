"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader, Skeleton, EmptyState } from "@/components/ui";
import { useBlogPosts } from "@/hooks/useApi";
import { formatDate, truncate } from "@/lib/utils";

export default function BlogPage() {
  const { data, isLoading } = useBlogPosts();
  const posts = data?.results ?? [];
  return (
    <><Navbar />
      <main className="container-page py-12">
        <PageHeader title="Blog & News" description="Studio updates, aftercare tips, guest artist spotlights, and more." />
        {isLoading ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>
        ) : posts.length === 0 ? (
          <EmptyState title="No posts yet" description="Check back soon for studio updates." />
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card group p-0 overflow-hidden">
                {post.cover_image ? (
                  <div className="relative aspect-video bg-ink-100"><Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" /></div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-ink-100 to-ink-50 flex items-center justify-center"><span className="text-3xl font-display text-ink-300">{post.title[0]}</span></div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">{post.tags.slice(0, 3).map((t: string) => <span key={t} className="badge bg-brand/10 text-brand text-xs">{t}</span>)}</div>
                  <h2 className="text-lg font-display group-hover:text-brand transition-colors line-clamp-2">{post.title}</h2>
                  <p className="mt-2 text-sm text-ink-500 line-clamp-2">{post.excerpt || truncate(post.body || "", 120)}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.published_at)}</span>
                    <span className="flex items-center gap-1 text-brand font-medium group-hover:underline">Read <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
