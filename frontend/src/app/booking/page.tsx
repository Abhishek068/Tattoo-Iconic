"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Upload,
  Calendar as CalendarIcon,
  Sparkles,
  Home,
  MapPin,
  Trash2,
  Clock,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTIST_PROFILE, SIZES, TATTOO_STYLES } from "@/constants";
import { bookingService } from "@/services/bookingService";
import { cn, getMinBookingDate } from "@/lib/utils";
import toast from "react-hot-toast";

// ── Schema for Studio Visit Form ──
const studioVisitSchema = z.object({
  customer_name: z.string().min(2, "Please enter your full name"),
  customer_phone: z.string().min(7, "Please enter your phone / WhatsApp number"),
  customer_email: z.string().email("Please enter a valid email address").or(z.literal("")),
  visitor_city: z.string().min(2, "Please enter your city / town (e.g. Rajpipla, Vadodara, Surat)"),
  preferred_date: z.string().min(1, "Please pick an appointment date"),
  preferred_time: z.string().min(1, "Please choose a time slot"),
  tattoo_description: z.string().min(5, "Please describe your tattoo idea or reference"),
  tattoo_style: z.string().min(1, "Please select a style"),
  placement: z.string().min(1, "Please specify body placement (e.g. Forearm, Wrist, Chest)"),
  approx_size: z.string().min(1, "Please select an approximate size"),
});

// ── Schema for Home Service Form ──
const homeServiceSchema = z.object({
  customer_name: z.string().min(2, "Please enter your full name"),
  customer_phone: z.string().min(7, "Please enter your phone / WhatsApp number"),
  customer_email: z.string().email("Please enter a valid email address").or(z.literal("")),
  home_address: z.string().min(5, "Please enter your full house address & street"),
  city_district: z.string().min(2, "Please enter your city/town & district (e.g. Rajpipla, Narmada, Vadodara, Bharuch)"),
  landmark: z.string().optional(),
  preferred_date: z.string().min(1, "Please pick an appointment date"),
  preferred_time: z.string().min(1, "Please choose a time slot"),
  tattoo_description: z.string().min(5, "Please describe your tattoo idea or reference"),
  tattoo_style: z.string().min(1, "Please select a style"),
  placement: z.string().min(1, "Please specify body placement (e.g. Forearm, Wrist, Chest)"),
  approx_size: z.string().min(1, "Please select an approximate size"),
});

type StudioFormData = z.infer<typeof studioVisitSchema>;
type HomeFormData = z.infer<typeof homeServiceSchema>;

function BookingTabsContent() {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("service") === "home_service" ? "home_service" : "studio_visit";

  const [activeTab, setActiveTab] = useState<"studio_visit" | "home_service">(initialTab);
  const [submitting, setSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  // Studio Form Hook
  const studioForm = useForm<StudioFormData>({
    resolver: zodResolver(studioVisitSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      visitor_city: "",
      preferred_date: "",
      preferred_time: "11:00",
      tattoo_description: "",
      tattoo_style: searchParams.get("style") || "Fine Line",
      placement: searchParams.get("placement") || "Forearm",
      approx_size: searchParams.get("size") || "Medium (4–6 inches)",
    },
  });

  // Home Service Form Hook
  const homeForm = useForm<HomeFormData>({
    resolver: zodResolver(homeServiceSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      home_address: "",
      city_district: "",
      landmark: "",
      preferred_date: "",
      preferred_time: "11:00",
      tattoo_description: "",
      tattoo_style: searchParams.get("style") || "Fine Line",
      placement: searchParams.get("placement") || "Forearm",
      approx_size: searchParams.get("size") || "Medium (4–6 inches)",
    },
  });

  // Handle image upload from user device / screenshot
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, WEBP).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setReferenceImages((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    toast.success("Reference photo added!");
  };

  const removeImage = (indexToRemove: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Studio Visit
  const onStudioSubmit = async (data: StudioFormData) => {
    setSubmitting(true);
    try {
      const newBooking = await bookingService.createBooking({
        customer_name: data.customer_name,
        customer_email: data.customer_email || `${data.customer_phone}@tattooiconic.in`,
        customer_phone: data.customer_phone,
        tattoo_description: data.tattoo_description,
        tattoo_style: data.tattoo_style,
        placement: data.placement,
        approx_size: data.approx_size,
        color_preference: "Black & Grey",
        service_type: "studio_visit",
        address: `Coming from: ${data.visitor_city} (Studio: At-Post Bhadam, Rajpipla)`,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        reference_images: referenceImages,
        whatsapp_preferred: true,
      });

      setSubmittedBooking({
        ...newBooking,
        service_type: "studio_visit",
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        tattoo_style: data.tattoo_style,
        placement: data.placement,
        approx_size: data.approx_size,
        tattoo_description: data.tattoo_description,
        location_detail: `Studio Visit · At-Post Bhadam, Rajpipla, Narmada (Client City: ${data.visitor_city})`,
      });
      toast.success("Studio Appointment Request Sent!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking. Please try again or WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Home Service
  const onHomeSubmit = async (data: HomeFormData) => {
    setSubmitting(true);
    try {
      const fullAddress = `${data.home_address}, ${data.city_district}${data.landmark ? ` (Near ${data.landmark})` : ""}`;
      const newBooking = await bookingService.createBooking({
        customer_name: data.customer_name,
        customer_email: data.customer_email || `${data.customer_phone}@tattooiconic.in`,
        customer_phone: data.customer_phone,
        tattoo_description: data.tattoo_description,
        tattoo_style: data.tattoo_style,
        placement: data.placement,
        approx_size: data.approx_size,
        color_preference: "Black & Grey",
        service_type: "home_service",
        address: fullAddress,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        reference_images: referenceImages,
        whatsapp_preferred: true,
      });

      setSubmittedBooking({
        ...newBooking,
        service_type: "home_service",
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        tattoo_style: data.tattoo_style,
        placement: data.placement,
        approx_size: data.approx_size,
        tattoo_description: data.tattoo_description,
        location_detail: `Luxury Home Service at: ${fullAddress}`,
      });
      toast.success("Home Service Appointment Request Sent!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking. Please try again or WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Confirmation Screen ──
  if (submittedBooking) {
    const waMessage = encodeURIComponent(
      `Hello Jainik Bhai, I just booked an appointment on Tattoo Iconic!\n\n` +
      `*Service:* ${submittedBooking.service_type === "studio_visit" ? "🏛️ STUDIO VISIT (Bhadam, Rajpipla)" : "🏠 LUXURY HOME SERVICE"}\n` +
      `*Name:* ${submittedBooking.customer_name}\n` +
      `*Phone:* ${submittedBooking.customer_phone}\n` +
      `*Date & Time:* ${submittedBooking.preferred_date} at ${submittedBooking.preferred_time}\n` +
      `*Location:* ${submittedBooking.location_detail}\n` +
      `*Tattoo Idea:* ${submittedBooking.tattoo_description}\n` +
      `*Style & Placement:* ${submittedBooking.tattoo_style} · ${submittedBooking.placement} (${submittedBooking.approx_size})\n` +
      `*Uploaded Photos:* ${referenceImages.length} image(s)`
    );

    return (
      <main className="container-page py-16 sm:py-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 border-emerald-500/40 text-center space-y-6 bg-gradient-to-b from-emerald-500/10 via-ink-900/90 to-ink-950"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/40">
            <CheckCircle2 size={44} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Appointment Request Received
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white font-bold mt-1">
              Thank You, {submittedBooking.customer_name}!
            </h1>
            <p className="text-sm text-ink-300 mt-2 leading-relaxed">
              Jainik Patel has received your{" "}
              <strong className="text-amber-300">
                {submittedBooking.service_type === "studio_visit"
                  ? "Studio Visit Appointment"
                  : "Luxury Home Service Appointment"}
              </strong>{" "}
              for{" "}
              <strong className="text-white">
                {submittedBooking.preferred_date} at {submittedBooking.preferred_time}
              </strong>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-950/80 p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Service Option:</span>
              <span className="font-semibold text-amber-300">
                {submittedBooking.service_type === "studio_visit"
                  ? "🏛️ Studio Visit (Bhadam, Rajpipla)"
                  : "🏠 Luxury Home Service (At Your House)"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Location / Address:</span>
              <span className="font-semibold text-white text-right max-w-xs truncate">
                {submittedBooking.location_detail}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Tattoo Concept:</span>
              <span className="font-semibold text-white">
                {submittedBooking.tattoo_style} · {submittedBooking.placement}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">Attached Reference Photos:</span>
              <span className="font-semibold text-emerald-400">{referenceImages.length} photo(s) attached</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/\+/g, "")}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-4 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30"
            >
              <MessageCircle size={18} />
              <span>Confirm Instantly on WhatsApp</span>
            </a>

            <Link href="/" className="btn-secondary w-full py-3 text-xs block text-center">
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container-page py-12 sm:py-16 max-w-3xl space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl text-white font-bold tracking-tight">
          Book Your Appointment
        </h1>
        <p className="text-sm sm:text-base text-ink-300 max-w-xl mx-auto leading-relaxed">
          Please choose whether you want to visit our private studio in Bhadam or request a luxury tattoo session at your own home.
        </p>

        {/* Quick Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <CheckCircle2 size={13} className="text-emerald-400" /> 10+ Yrs Experience
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <CheckCircle2 size={13} className="text-emerald-400" /> 7,000+ Inked
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <ShieldCheck size={13} className="text-amber-400" /> Clinical Sterility
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 SERVICE SELECTION TABS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tab 1: Studio Visit */}
        <button
          type="button"
          onClick={() => setActiveTab("studio_visit")}
          className={cn(
            "rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden group",
            activeTab === "studio_visit"
              ? "border-amber-500/70 bg-gradient-to-b from-amber-500/20 via-ink-900 to-ink-950 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/40"
              : "border-white/10 bg-ink-950/60 hover:border-white/20 hover:bg-white/5 opacity-80"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
              activeTab === "studio_visit"
                ? "bg-amber-500/30 text-amber-300 border-amber-500/50"
                : "bg-white/5 text-ink-400 border-white/10"
            )}>
              <MapPin size={24} />
            </div>
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              activeTab === "studio_visit"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/5 text-ink-400"
            )}>
              Option 1 · Studio
            </span>
          </div>

          <h3 className="font-display text-xl text-white font-bold">
            Private Studio Visit
          </h3>
          <p className="text-xs text-amber-300/90 font-semibold mt-0.5">
            Customer Visits Jainik&apos;s Studio
          </p>
          <p className="text-xs text-ink-300 mt-2 leading-relaxed">
            At-Post Bhadam, Rajpipla, Narmada. Quiet 1-on-1 private suite with clinical sterilization.
          </p>
        </button>

        {/* Tab 2: Home Service */}
        <button
          type="button"
          onClick={() => setActiveTab("home_service")}
          className={cn(
            "rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden group",
            activeTab === "home_service"
              ? "border-amber-500/70 bg-gradient-to-b from-amber-500/20 via-ink-900 to-ink-950 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/40"
              : "border-white/10 bg-ink-950/60 hover:border-white/20 hover:bg-white/5 opacity-80"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
              activeTab === "home_service"
                ? "bg-amber-500/30 text-amber-300 border-amber-500/50"
                : "bg-white/5 text-ink-400 border-white/10"
            )}>
              <Home size={24} />
            </div>
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              activeTab === "home_service"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/5 text-ink-400"
            )}>
              Option 2 · VIP Home
            </span>
          </div>

          <h3 className="font-display text-xl text-white font-bold">
            Luxury Home Service
          </h3>
          <p className="text-xs text-emerald-400 font-semibold mt-0.5">
            Jainik Visits Your House
          </p>
          <p className="text-xs text-ink-300 mt-2 leading-relaxed">
            Mobile inking across Rajpipla, Narmada, Bharuch, Vadodara, Surat &amp; all of Gujarat.
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FORM 1: STUDIO VISIT FORM */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {activeTab === "studio_visit" && (
          <motion.div
            key="studio-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Form Banner */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-ink-200">
              <MapPin size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">
                  Booking for: Studio Visit in Bhadam, Rajpipla
                </p>
                <p className="text-ink-300 mt-0.5">
                  Studio Address: <strong>At-Post Bhadam, Taluka- Rajpipla, District- Narmada, Gujarat</strong>. (Exact directions and landmark map provided upon confirmation).
                </p>
              </div>
            </div>

            <form onSubmit={studioForm.handleSubmit(onStudioSubmit)} className="space-y-6">
              {/* 1. Client Info */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <User size={16} className="text-amber-400" />
                  <span>1. Your Contact Information</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      {...studioForm.register("customer_name")}
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                    {studioForm.formState.errors.customer_name && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Phone / WhatsApp Number *</label>
                    <input
                      {...studioForm.register("customer_phone")}
                      placeholder="e.g. 9876543210"
                      className="input-field"
                    />
                    {studioForm.formState.errors.customer_phone && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.customer_phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email Address (Optional)</label>
                    <input
                      {...studioForm.register("customer_email")}
                      placeholder="your.email@example.com"
                      className="input-field"
                    />
                    {studioForm.formState.errors.customer_email && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.customer_email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Where are you traveling from? (City / Village) *</label>
                    <input
                      {...studioForm.register("visitor_city")}
                      placeholder="e.g. Rajpipla, Vadodara, Bharuch, Surat, Bhadam"
                      className="input-field"
                    />
                    {studioForm.formState.errors.visitor_city && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.visitor_city.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Schedule */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <CalendarIcon size={16} className="text-amber-400" />
                  <span>2. Preferred Studio Date &amp; Time</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Select Date *</label>
                    <input
                      type="date"
                      min={getMinBookingDate(0)}
                      {...studioForm.register("preferred_date")}
                      className="input-field [color-scheme:dark]"
                    />
                    {studioForm.formState.errors.preferred_date && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.preferred_date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Select Time Slot *</label>
                    <select {...studioForm.register("preferred_time")} className="input-field">
                      <option value="10:00" className="bg-ink-900 text-white">10:00 AM (Morning Slot)</option>
                      <option value="11:00" className="bg-ink-900 text-white">11:00 AM</option>
                      <option value="12:30" className="bg-ink-900 text-white">12:30 PM (Afternoon Slot)</option>
                      <option value="14:00" className="bg-ink-900 text-white">02:00 PM</option>
                      <option value="15:30" className="bg-ink-900 text-white">03:30 PM</option>
                      <option value="17:00" className="bg-ink-900 text-white">05:00 PM (Evening Slot)</option>
                      <option value="Flexible / Anytime" className="bg-ink-900 text-white">Flexible / Any Time (Everyday)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Tattoo Concept & Reference Upload */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>3. Tattoo Details &amp; Reference Pictures</span>
                </h3>

                <div>
                  <label className="label">Describe Your Tattoo Idea *</label>
                  <textarea
                    {...studioForm.register("tattoo_description")}
                    rows={3}
                    placeholder="e.g. Mahadev Trishul with Sanskrit mantra, Lord Hanuman portrait, Lion sleeve, Name script..."
                    className="input-field"
                  />
                  {studioForm.formState.errors.tattoo_description && (
                    <p className="mt-1 text-xs text-red-400">
                      {studioForm.formState.errors.tattoo_description.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Preferred Style</label>
                    <select {...studioForm.register("tattoo_style")} className="input-field">
                      {TATTOO_STYLES.map((s) => (
                        <option key={s} value={s} className="bg-ink-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Placement *</label>
                    <input
                      {...studioForm.register("placement")}
                      placeholder="e.g. Forearm, Wrist, Chest"
                      className="input-field"
                    />
                    {studioForm.formState.errors.placement && (
                      <p className="mt-1 text-xs text-red-400">
                        {studioForm.formState.errors.placement.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Approximate Size</label>
                    <select {...studioForm.register("approx_size")} className="input-field">
                      {SIZES.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.label} className="bg-ink-900 text-white">
                          {sizeOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Upload Photo Box */}
                <div className="pt-2 space-y-3">
                  <label className="label flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-amber-400" />
                      Upload Picture / Screenshot (Instagram, Pinterest, Google)
                    </span>
                    <span className="text-[10px] text-ink-400 font-normal">Optional</span>
                  </label>

                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-ink-950/60 p-6 text-center cursor-pointer hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <p className="font-semibold text-sm text-white mt-3">
                      Click to upload reference tattoo photos
                    </p>
                    <p className="text-xs text-ink-400 mt-1">
                      Upload photos or screenshots you found elsewhere (PNG, JPG, WEBP)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Previews */}
                  {referenceImages.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Uploaded Photos ({referenceImages.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {referenceImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-white/20 bg-ink-950 shadow-md group"
                          >
                            <img src={imgUrl} alt={`Reference ${idx + 1}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Studio */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 text-base font-bold shadow-2xl shadow-brand/40 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Submitting Studio Booking...</span>
                  </div>
                ) : (
                  <>
                    <MapPin size={18} />
                    <span>Confirm Studio Visit Appointment &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* FORM 2: LUXURY HOME SERVICE FORM */}
        {/* ========================================================================= */}
        {activeTab === "home_service" && (
          <motion.div
            key="home-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Form Banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-ink-200">
              <Home size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">
                  Booking for: Luxury Home Service (Jainik Visits Your House)
                </p>
                <p className="text-ink-300 mt-0.5">
                  Jainik travels with a complete portable sterile tattoo workstation directly to your house in <strong>Rajpipla, Narmada, Bharuch, Vadodara, Surat, or anywhere across Gujarat</strong>.
                </p>
              </div>
            </div>

            <form onSubmit={homeForm.handleSubmit(onHomeSubmit)} className="space-y-6">
              {/* 1. Client Contact & Exact Home Address */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <User size={16} className="text-amber-400" />
                  <span>1. Your Contact &amp; Home Address</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      {...homeForm.register("customer_name")}
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                    {homeForm.formState.errors.customer_name && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Phone / WhatsApp Number *</label>
                    <input
                      {...homeForm.register("customer_phone")}
                      placeholder="e.g. 9876543210"
                      className="input-field"
                    />
                    {homeForm.formState.errors.customer_phone && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.customer_phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email Address (Optional)</label>
                    <input
                      {...homeForm.register("customer_email")}
                      placeholder="your.email@example.com"
                      className="input-field"
                    />
                    {homeForm.formState.errors.customer_email && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.customer_email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">City / Town &amp; District *</label>
                    <input
                      {...homeForm.register("city_district")}
                      placeholder="e.g. Rajpipla, Narmada, Vadodara, Bharuch, Surat"
                      className="input-field"
                    />
                    {homeForm.formState.errors.city_district && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.city_district.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Full House Address / Society / Street *</label>
                    <input
                      {...homeForm.register("home_address")}
                      placeholder="House No, Society / Apartment Name, Street Area"
                      className="input-field"
                    />
                    {homeForm.formState.errors.home_address && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.home_address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Nearby Landmark (Optional)</label>
                    <input
                      {...homeForm.register("landmark")}
                      placeholder="e.g. Near Temple / School"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Schedule */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <CalendarIcon size={16} className="text-amber-400" />
                  <span>2. Preferred Home Visit Date &amp; Time</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Select Date *</label>
                    <input
                      type="date"
                      min={getMinBookingDate(0)}
                      {...homeForm.register("preferred_date")}
                      className="input-field [color-scheme:dark]"
                    />
                    {homeForm.formState.errors.preferred_date && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.preferred_date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Select Time Slot *</label>
                    <select {...homeForm.register("preferred_time")} className="input-field">
                      <option value="10:00" className="bg-ink-900 text-white">10:00 AM (Morning Slot)</option>
                      <option value="11:00" className="bg-ink-900 text-white">11:00 AM</option>
                      <option value="12:30" className="bg-ink-900 text-white">12:30 PM (Afternoon Slot)</option>
                      <option value="14:00" className="bg-ink-900 text-white">02:00 PM</option>
                      <option value="15:30" className="bg-ink-900 text-white">03:30 PM</option>
                      <option value="17:00" className="bg-ink-900 text-white">05:00 PM (Evening Slot)</option>
                      <option value="Flexible / Anytime" className="bg-ink-900 text-white">Flexible / Any Time (Everyday)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Tattoo Details & Photo Upload */}
              <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>3. Tattoo Details &amp; Reference Pictures</span>
                </h3>

                <div>
                  <label className="label">Describe Your Tattoo Idea *</label>
                  <textarea
                    {...homeForm.register("tattoo_description")}
                    rows={3}
                    placeholder="e.g. Mahadev Trishul, Lord Hanuman Ji, Lion portrait, Sacred Sanskrit script..."
                    className="input-field"
                  />
                  {homeForm.formState.errors.tattoo_description && (
                    <p className="mt-1 text-xs text-red-400">
                      {homeForm.formState.errors.tattoo_description.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Preferred Style</label>
                    <select {...homeForm.register("tattoo_style")} className="input-field">
                      {TATTOO_STYLES.map((s) => (
                        <option key={s} value={s} className="bg-ink-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Placement *</label>
                    <input
                      {...homeForm.register("placement")}
                      placeholder="e.g. Forearm, Wrist, Chest, Back"
                      className="input-field"
                    />
                    {homeForm.formState.errors.placement && (
                      <p className="mt-1 text-xs text-red-400">
                        {homeForm.formState.errors.placement.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Approximate Size</label>
                    <select {...homeForm.register("approx_size")} className="input-field">
                      {SIZES.map((sizeOption) => (
                        <option key={sizeOption.value} value={sizeOption.label} className="bg-ink-900 text-white">
                          {sizeOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Upload Photo Box */}
                <div className="pt-2 space-y-3">
                  <label className="label flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-amber-400" />
                      Upload Picture / Screenshot (Instagram, Pinterest, Google)
                    </span>
                    <span className="text-[10px] text-ink-400 font-normal">Optional</span>
                  </label>

                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-ink-950/60 p-6 text-center cursor-pointer hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <p className="font-semibold text-sm text-white mt-3">
                      Click to upload reference tattoo photos
                    </p>
                    <p className="text-xs text-ink-400 mt-1">
                      Upload photos or screenshots you found elsewhere (PNG, JPG, WEBP)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Previews */}
                  {referenceImages.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Uploaded Photos ({referenceImages.length})
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {referenceImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-white/20 bg-ink-950 shadow-md group"
                          >
                            <img src={imgUrl} alt={`Reference ${idx + 1}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Home Service */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-4 text-base font-bold shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-ink-950 border-t-transparent animate-spin" />
                    <span>Submitting Home Service Booking...</span>
                  </div>
                ) : (
                  <>
                    <Home size={18} />
                    <span>Request Luxury Home Service &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="container-page py-20 text-center text-ink-400">Loading booking forms...</div>}>
        <BookingTabsContent />
      </Suspense>
      <Footer />
    </>
  );
}
