"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Send,
  ChevronDown,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTIST_PROFILE, STUDIO_FAQS } from "@/constants";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Message sent directly to Jainik Patel! We will reply within 24 hours.");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  return (
    <>
      <Navbar />

      <main className="container-hero py-12 sm:py-16 space-y-16">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
            Contact Jainik Patel
          </h1>
          <p className="text-sm sm:text-base text-ink-300 mt-3 leading-relaxed">
            Have a question about a custom design, home service availability, or studio appointments? Reach out directly via the form, WhatsApp, or Instagram.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Info Cards & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Artist Contact Card */}
            <div className="glass-card p-6 sm:p-7 border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-ink-900/90 to-ink-950 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white font-bold">
                    Direct Contact · Jainik Patel
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium">
                    Master Artist &amp; Studio Owner
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {/* Phone Call Button */}
                <a
                  href={`tel:${ARTIST_PROFILE.phone.replace(/\s+/g, "")}`}
                  className="btn-primary w-full text-center py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand/20 group"
                >
                  <Phone size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Call: {ARTIST_PROFILE.phone}</span>
                </a>

                {/* Direct Email Button */}
                <a
                  href={`mailto:${ARTIST_PROFILE.email}`}
                  className="btn-secondary w-full text-center py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-white/20 hover:border-amber-400/40 group"
                >
                  <Mail size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Email: {ARTIST_PROFILE.email}</span>
                </a>
              </div>
            </div>

            {/* Studio Coordinates & Hours */}
            <div className="glass-card p-6 space-y-4 text-xs sm:text-sm text-ink-300">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Private Studio Atelier</p>
                  <p className="text-xs text-ink-300 mt-0.5">
                    At-Post Bhadam, Taluka- Rajpipla, District- Narmada, Gujarat
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    (Exact landmark directions provided upon booking approval)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Working Hours</p>
                  <p className="text-xs text-ink-300 mt-0.5">
                    Available Everyday · Any Time (By Appointment)
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">Studio Visits &amp; Luxury Mobile Home Service Available 7 Days a Week</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                <Instagram size={18} className="text-brand-light shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Instagram Profile</p>
                  <a
                    href={`https://instagram.com/${ARTIST_PROFILE.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-light hover:underline block mt-0.5"
                  >
                    @{ARTIST_PROFILE.instagram_handle}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 border-white/15">
            <h2 className="font-display text-2xl text-white font-bold mb-2">
              Send a Direct Message
            </h2>
            <p className="text-xs text-ink-400 mb-6">
              Fill in your inquiry below and Jainik will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Sterling"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. marcus@example.com"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone / WhatsApp Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 8238767100"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Your Message or Question</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us about your tattoo idea, home service question, or consultation request..."
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-center py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Send Direct Inquiry</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Accordion */}
        <section id="faqs" className="max-w-4xl mx-auto space-y-6 pt-10">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Common Questions
            </span>
            <h2 className="font-display text-3xl text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {STUDIO_FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-white/10 bg-ink-900/70 backdrop-blur-md overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display text-base sm:text-lg text-white"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-ink-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-brand-light" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-ink-300 leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
