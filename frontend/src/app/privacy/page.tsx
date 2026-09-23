import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, CheckCircle2, HeartHandshake } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Tattoo Iconic - Jainik Patel",
  description:
    "Privacy Policy for Tattoo Iconic. Learn how your enquiry and appointment information is protected, stored, and used exclusively for your tattoo consultation.",
  alternates: {
    canonical: "https://tattooiconic.in/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="container-page py-14 sm:py-20 max-w-4xl space-y-10 min-h-screen">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
            <ShieldCheck size={13} />
            <span>Transparency &amp; Collector Protection</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-white font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 max-w-lg mx-auto leading-relaxed">
            Last Updated: September 2026 · Tattoo Iconic Studio (Jainik Patel)
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 sm:p-10 border-white/10 space-y-8 bg-ink-950/70 text-ink-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white font-bold flex items-center gap-2">
              <Lock size={18} className="text-amber-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you submit a tattoo enquiry or appointment request through Tattoo Iconic, we collect only the information necessary to design your custom piece and coordinate your session:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-ink-200">
              <li><strong>Contact Details:</strong> Your full name, email address, and phone / WhatsApp number.</li>
              <li><strong>Tattoo Concepts:</strong> Design idea, preferred style, body placement, estimated size, and colour preferences.</li>
              <li><strong>Appointment Preferences:</strong> Preferred appointment date, alternative dates, time slots, and whether you prefer a Studio Visit in Bhadam (Rajpipla) or Luxury Home Service at your residence.</li>
              <li><strong>Location Information:</strong> City, town, or home address (only when requesting mobile home tattoo service across Gujarat).</li>
              <li><strong>Reference Photos:</strong> Optional image attachments or inspiration URLs you choose to share.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white font-bold flex items-center gap-2">
              <HeartHandshake size={18} className="text-amber-400" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p>
              We treat your personal data with absolute discretion and confidentiality. Your information is used strictly for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-ink-200">
              <li>Responding to your tattoo inquiry, discussing custom composition, and providing transparent price estimates.</li>
              <li>Scheduling and confirming your private studio appointment or mobile doorstep home service.</li>
              <li>Contacting you via WhatsApp or phone call regarding your session details, aftercare guidelines, or appointment adjustments.</li>
            </ul>
            <p className="text-amber-300/90 font-medium">
              We never sell, rent, lease, or share your contact information with third-party marketers or advertisers. We do not engage in automated spam.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-amber-400" />
              <span>3. Data Storage &amp; Security</span>
            </h2>
            <p>
              During Phase 1 of our digital platform, enquiries submitted via the website are securely transmitted using server-side Next.js endpoints to an encrypted administrative Google Sheets storage system accessible exclusively by Master Artist Jainik Patel.
            </p>
            <p>
              All Google authentication credentials and API keys are stored on private, server-side environments and are never exposed to browser client-side code.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white font-bold">
              4. WhatsApp Communication
            </h2>
            <p>
              Upon submitting your enquiry, you are provided with an official WhatsApp click-to-chat reference link containing your unique Client Reference ID (e.g. <code>CL-20260922-XXXX</code>). Direct communication takes place via end-to-end encrypted WhatsApp channels.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white font-bold">
              5. Contact &amp; Rights
            </h2>
            <p>
              You have the right to request access to your submitted enquiry details or ask for your information to be deleted from our records at any time.
            </p>
            <p>
              For privacy inquiries, please reach out directly:
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-1 text-ink-200">
              <p><strong>Studio:</strong> Tattoo Iconic Atelier</p>
              <p><strong>Artist:</strong> Jainik Patel</p>
              <p><strong>Location:</strong> At-Post Bhadam, Taluka- Rajpipla, District- Narmada, Gujarat, India</p>
              <p><strong>WhatsApp / Phone:</strong> +91 8238767100</p>
            </div>
          </section>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/book" className="btn-primary py-3 px-6 text-xs font-bold w-full sm:w-auto text-center">
              Submit a Tattoo Enquiry &rarr;
            </Link>
            <Link href="/" className="text-xs text-ink-400 hover:text-white transition-colors">
              &larr; Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
