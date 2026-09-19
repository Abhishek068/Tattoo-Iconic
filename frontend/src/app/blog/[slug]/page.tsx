"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Spinner } from "@/components/ui";
import { useBlogPost } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug);
  if (isLoading) return <><Navbar /><Spinner /><Footer /></>;
  if (!post) return <><Navbar /><div className="container-page py-20 text-center"><h1 className="text-2xl">Post not found</h1></div><Footer /></>;
  return (
    <><Navbar />
      <main className="container-page py-12">
        <Link href="/blog" className="btn-ghost text-sm mb-6 inline-flex items-center gap-1"><ArrowLeft size={16} /> All posts</Link>
        <article className="max-w-3xl mx-auto">
          {post.cover_image && <div className="relative aspect-video overflow-hidden rounded-xl mb-8 bg-ink-100"><Image src={post.cover_image} alt={post.title} fill className="object-cover" sizes="100vw" priority /></div>}
          <div className="flex flex-wrap gap-2 mb-4">{post.tags.map((t: string) => <span key={t} className="badge bg-brand/10 text-brand">{t}</span>)}</div>
          <h1 className="text-3xl sm:text-4xl leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1"><User size={14} /> {post.author_name}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.published_at)}</span>
          </div>
          <div className="mt-8 prose prose-ink max-w-none text-ink-700 leading-relaxed whitespace-pre-wrap">{post.body}</div>
          <div className="mt-12 border-t border-ink-100 pt-8 text-center">
            <p className="text-ink-500">Interested in getting tattooed?</p>
            <Link href="/booking" className="btn-primary mt-3">Book an appointment</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
