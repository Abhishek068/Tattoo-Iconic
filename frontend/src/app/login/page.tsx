"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push("/dashboard/appointments");
  }

  return (
    <><Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-sm animate-fade-in">
          <h1 className="text-center text-3xl">Sign in</h1>
          <p className="mt-2 text-center text-sm text-ink-500">Access your bookings and dashboard.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <div><label htmlFor="email" className="label">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" /></div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative"><input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in…" : "Sign in"}</button>
          </form>
          <div className="mt-6"><div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-200" /></div><div className="relative flex justify-center text-sm"><span className="bg-cream px-4 text-ink-400">or</span></div></div>
            <button onClick={() => signIn("google", { callbackUrl: "/dashboard/appointments" })} className="btn-secondary mt-4 w-full">Continue with Google</button>
          </div>
          <p className="mt-6 text-center text-sm text-ink-500">Don't have an account? <Link href="/register" className="font-medium text-brand hover:underline">Create one</Link></p>
        </div>
      </main>
    </>
  );
}
