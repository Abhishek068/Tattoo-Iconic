"use client";
import Link from "next/link";
import { Plus, FileText, Edit } from "lucide-react";
import { useBlogPosts } from "@/hooks/useApi";
import { Skeleton, EmptyState, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function DashboardBlogPage() {
  const { data, isLoading } = useBlogPosts();
  const posts = data?.results ?? [];
  return (
    <div>
      <div className="flex justify-end mb-6"><Link href="/dashboard/blog/new" className="btn-primary text-sm"><Plus size={16} className="mr-1" /> New Post</Link></div>
      {isLoading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div> :
       posts.length === 0 ? <EmptyState icon={<FileText size={48} />} title="No blog posts" description="Create your first post." action={<Link href="/dashboard/blog/new" className="btn-primary text-sm">Create post</Link>} /> :
       <div className="space-y-3">{posts.map((p) => (
         <div key={p.id} className="card flex items-center justify-between">
           <div className="min-w-0">
             <div className="flex items-center gap-2"><h3 className="font-medium truncate">{p.title}</h3>{p.status && <span className={`badge ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-ink-100 text-ink-600"}`}>{p.status}</span>}</div>
             <p className="text-xs text-ink-400 mt-1">{p.author_name} · {formatDate(p.published_at)}</p>
           </div>
           <Link href={`/dashboard/blog/${p.slug}`} className="btn-ghost text-xs shrink-0"><Edit size={14} className="mr-1" /> Edit</Link>
         </div>
       ))}</div>}
    </div>
  );
}
