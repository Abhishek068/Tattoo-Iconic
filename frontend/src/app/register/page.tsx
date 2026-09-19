"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { postData } from "@/lib/api";
import toast from "react-hot-toast";

const schema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().email("Valid email required"),
  username: z.string().min(3, "At least 3 characters"),
  phone: z.string().optional(),
  password: z.string().min(8, "At least 8 characters"),
  password_confirm: z.string(),
}).refine((d) => d.password === d.password_confirm, { message: "Passwords don't match", path: ["password_confirm"] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await postData("/auth/register/", data);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.username?.[0] || "Registration failed.";
      toast.error(msg);
    } finally { setLoading(false); }
  }

  return (
    <><Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="text-center text-3xl">Create your account</h1>
          <p className="mt-2 text-center text-sm text-ink-500">Book appointments and track your tattoo journey.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">First name</label><input {...register("first_name")} className="input-field" />{errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}</div>
              <div><label className="label">Last name</label><input {...register("last_name")} className="input-field" />{errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}</div>
            </div>
            <div><label className="label">Email</label><input type="email" {...register("email")} className="input-field" placeholder="you@example.com" />{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div>
            <div><label className="label">Username</label><input {...register("username")} className="input-field" />{errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}</div>
            <div><label className="label">Phone (optional)</label><input {...register("phone")} className="input-field" placeholder="+44…" /></div>
            <div><label className="label">Password</label><input type="password" {...register("password")} className="input-field" />{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}</div>
            <div><label className="label">Confirm password</label><input type="password" {...register("password_confirm")} className="input-field" />{errors.password_confirm && <p className="mt-1 text-xs text-red-600">{errors.password_confirm.message}</p>}</div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating account…" : "Create Account"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-500">Already have an account? <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link></p>
        </div>
      </main>
    </>
  );
}
