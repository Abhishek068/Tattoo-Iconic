"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCreateBlogPost } from "@/hooks/useApi";
import toast from "react-hot-toast";

interface BlogForm { title: string; excerpt: string; body: string; tags: string; status: string; }

export default function NewBlogPostPage() {
  const router = useRouter();
  const create = useCreateBlogPost();
  const { register, handleSubmit, formState: { errors } } = useForm<BlogForm>({ defaultValues: { status: "draft" } });

  async function onSubmit(data: BlogForm) {
    try {
      await create.mutateAsync({ ...data, tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean), published_at: data.status === "published" ? new Date().toISOString() : null });
      toast.success("Post created!"); router.push("/dashboard/blog");
    } catch { toast.error("Failed to create post"); }
  }

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/blog" className="btn-ghost text-sm mb-6 inline-flex items-center gap-1"><ArrowLeft size={16} /> Back</Link>
      <h1 className="text-2xl font-display mb-6">New Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div><label className="label">Title</label><input {...register("title", { required: "Required" })} className="input-field text-lg" placeholder="Post title" />{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}</div>
        <div><label className="label">Excerpt</label><textarea {...register("excerpt")} rows={2} className="input-field" placeholder="Short description…" /></div>
        <div><label className="label">Content</label><textarea {...register("body", { required: "Required" })} rows={15} className="input-field font-mono text-sm" placeholder="Write your post here…" />{errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}</div>
        <div><label className="label">Tags (comma separated)</label><input {...register("tags")} className="input-field" placeholder="aftercare, tips, news" /></div>
        <div><label className="label">Status</label><select {...register("status")} className="input-field"><option value="draft">Draft</option><option value="published">Published</option></select></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={create.isPending} className="btn-primary">{create.isPending ? "Saving…" : "Save Post"}</button>
          <Link href="/dashboard/blog" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
