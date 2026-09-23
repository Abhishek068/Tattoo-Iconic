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
  Clock,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
  Palette,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTIST_PROFILE, SIZES, TATTOO_STYLES } from "@/constants";
import { enquiryService } from "@/services/enquiry.service";
import { cn, getMinBookingDate } from "@/lib/utils";
import type { EnquirySubmissionResult, EnquiryColourPreference, EnquiryServiceType } from "@/types";
import toast from "react-hot-toast";

// ── Validation Schema for Tattoo Enquiry ──
const enquirySchema = z.object({
  full_name: z.string().min(2, "Please enter your full name (minimum 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter your valid phone / WhatsApp number"),
  tattoo_idea: z.string().min(3, "Please describe your tattoo idea or motif"),
  tattoo_style: z.string().default("Spiritual"),
  placement: z.string().min(1, "Please enter body placement (e.g. Forearm, Wrist, Chest)"),
  approx_size: z.string().default("Medium (4–6 inches)"),
  color_preference: z.enum(["Black & Grey", "Colour", "Not Sure"]).default("Black & Grey"),
  service_type: z.enum(["Visit Artist", "Home Tattoo Service"]).default("Visit Artist"),
  city_or_address: z.string().optional(),
  preferred_date: z.string().min(1, "Please select your preferred date"),
  alternative_date: z.string().optional(),
  preferred_time: z.string().default("11:00 AM"),
  detailed_description: z.string().optional(),
  reference_image_url: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

function EnquiryFormInner() {
  const searchParams = useSearchParams();
  const defaultStyle = searchParams.get("style") || "Spiritual";
  const defaultPlacement = searchParams.get("placement") || "Forearm";
  const defaultSize = searchParams.get("size") || "Medium (4–6 inches)";
  const defaultService =
    searchParams.get("service") === "home_service" ? "Home Tattoo Service" : "Visit Artist";

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<EnquirySubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState<{ message: string; whatsapp_url: string } | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      tattoo_idea: "",
      tattoo_style: defaultStyle,
      placement: defaultPlacement,
      approx_size: defaultSize,
      color_preference: "Black & Grey",
      service_type: defaultService,
      city_or_address: "",
      preferred_date: "",
      alternative_date: "",
      preferred_time: "11:00 AM",
      detailed_description: "",
      reference_image_url: "",
    },
  });

  const selectedServiceType = watch("service_type");
  const selectedColour = watch("color_preference");

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
    toast.success("Reference photo attached!");
  };

  const removeImage = (indexToRemove: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submission
  const onSubmit = async (values: EnquiryFormValues) => {
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await enquiryService.submitEnquiry({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        tattoo_idea: values.tattoo_idea,
        tattoo_style: values.tattoo_style,
        placement: values.placement,
        approx_size: values.approx_size,
        color_preference: values.color_preference as EnquiryColourPreference,
        service_type: values.service_type as EnquiryServiceType,
        preferred_date: values.preferred_date,
        alternative_date: values.alternative_date,
        preferred_time: values.preferred_time,
        detailed_description: values.detailed_description,
        reference_image_url: values.reference_image_url || (referenceImages.length > 0 ? "Attached photos" : ""),
        reference_images: referenceImages,
        city: values.city_or_address,
        address: values.city_or_address,
      });

      if (result.success) {
        setSubmissionResult(result);
        toast.success("Enquiry received successfully!");
      } else {
        // Friendly fallback
        setSubmissionError({
          message:
            result.error ||
            "We couldn't submit your enquiry right now. Please contact us directly on WhatsApp.",
          whatsapp_url: result.whatsapp_url,
        });
        toast.error("Unable to record enquiry. Please continue on WhatsApp.");
      }
    } catch (err) {
      console.error(err);
      setSubmissionError({
        message:
          "We couldn't submit your enquiry right now. Please contact us directly on WhatsApp.",
        whatsapp_url: `https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          `Hi Jainik, I tried submitting a tattoo enquiry on your website: ${values.tattoo_idea}. Please assist me!`
        )}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════
  // VIEW 1: SUCCESS CONFIRMATION ("ENQUIRY RECEIVED")
  // ══════════════════════════════════════════════════════════════
  if (submissionResult) {
    const enquiry = submissionResult.enquiry;

    return (
      <main className="container-page pt-28 sm:pt-36 pb-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 border-emerald-500/40 text-center space-y-6 bg-gradient-to-b from-emerald-500/10 via-ink-900/90 to-ink-950 shadow-2xl"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={44} />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
              ENQUIRY RECEIVED
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white font-bold">
              Thank You, {enquiry?.full_name || "Collector"}!
            </h1>
            <p className="text-sm text-ink-300 max-w-md mx-auto leading-relaxed">
              Your enquiry has been submitted successfully. We will review your request and contact you shortly.
            </p>
          </div>

          {/* Reference Card */}
          <div className="rounded-2xl border border-white/10 bg-ink-950/80 p-5 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-ink-400 uppercase tracking-wider font-semibold text-[11px]">
                Reference ID:
              </span>
              <span className="font-mono text-base font-bold text-amber-300 tracking-wide bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                {submissionResult.client_id}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Tattoo Concept:</span>
              <span className="font-semibold text-white max-w-xs text-right truncate">
                {enquiry?.tattoo_idea}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Style &amp; Placement:</span>
              <span className="font-semibold text-white">
                {enquiry?.tattoo_style} · {enquiry?.placement} ({enquiry?.approx_size})
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-ink-400">Service Option:</span>
              <span className="font-semibold text-amber-300">
                {enquiry?.service_type === "Home Tattoo Service"
                  ? "🏠 Luxury Home Service (Doorstep)"
                  : "🏛️ Studio Visit (Bhadam, Rajpipla)"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-400">Preferred Date &amp; Time:</span>
              <span className="font-semibold text-emerald-400">
                {enquiry?.preferred_date} ({enquiry?.preferred_time})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-3">
            <a
              href={submissionResult.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>CONTINUE ON WHATSAPP</span>
            </a>

            <Link
              href="/"
              className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white py-3 text-xs block text-center transition-all font-semibold"
            >
              RETURN TO WEBSITE
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // VIEW 2: GRACEFUL ERROR FALLBACK
  // ══════════════════════════════════════════════════════════════
  if (submissionError) {
    return (
      <main className="container-page pt-28 sm:pt-36 pb-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 border-amber-500/40 text-center space-y-6 bg-gradient-to-b from-amber-500/10 via-ink-900/90 to-ink-950 shadow-2xl"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mx-auto border border-amber-500/40">
            <AlertCircle size={44} />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl text-white font-bold">
              Direct WhatsApp Booking
            </h1>
            <p className="text-sm text-ink-300 max-w-md mx-auto leading-relaxed">
              {submissionError.message}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={submissionError.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>CONTACT ON WHATSAPP</span>
            </a>

            <button
              onClick={() => setSubmissionError(null)}
              className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white py-3 text-xs flex items-center justify-center gap-2 font-semibold cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Try Submitting Form Again</span>
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // VIEW 3: TATTOO ENQUIRY FORM
  // ══════════════════════════════════════════════════════════════
  return (
    <main className="container-page pt-28 sm:pt-36 pb-20 max-w-3xl space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
          <Sparkles size={13} />
          <span>Bespoke Tattoo Consultation</span>
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-white font-bold tracking-tight">
          Tattoo Enquiry &amp; Booking
        </h1>
        <p className="text-sm sm:text-base text-ink-300 max-w-xl mx-auto leading-relaxed">
          Submit your concept to Master Artist Jainik Patel. We will review your piece and arrange your studio or luxury home session.
        </p>

        {/* Badges */}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION 1: CUSTOMER INFORMATION */}
        {/* ========================================================================= */}
        <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <User size={16} className="text-amber-400" />
            <span>1. Customer Information</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input
                {...register("full_name")}
                placeholder="e.g. Rahul Sharma"
                className="input-field"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-400">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Phone / WhatsApp Number *</label>
              <input
                {...register("phone")}
                placeholder="e.g. +91 98251 23456"
                className="input-field"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Email Address *</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. rahul.sharma@example.com"
              className="input-field"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: TATTOO INFORMATION */}
        {/* ========================================================================= */}
        <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>2. Tattoo Information</span>
          </h3>

          <div>
            <label className="label">Tattoo Idea &amp; Concept *</label>
            <textarea
              {...register("tattoo_idea")}
              rows={3}
              placeholder="e.g. Lord Shiva Trishul with Sanskrit mantra, Lord Hanuman portrait, Lion sleeve, Fine-line botanical branch..."
              className="input-field"
            />
            {errors.tattoo_idea && (
              <p className="mt-1 text-xs text-red-400">{errors.tattoo_idea.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Tattoo Style</label>
              <select {...register("tattoo_style")} className="input-field">
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
                {...register("placement")}
                placeholder="e.g. Forearm, Wrist, Chest, Spine"
                className="input-field"
              />
              {errors.placement && (
                <p className="mt-1 text-xs text-red-400">{errors.placement.message}</p>
              )}
            </div>

            <div>
              <label className="label">Approximate Size</label>
              <select {...register("approx_size")} className="input-field">
                {SIZES.map((sizeOption) => (
                  <option key={sizeOption.value} value={sizeOption.label} className="bg-ink-900 text-white">
                    {sizeOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Colour Preference */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Palette size={14} className="text-amber-400" />
              <span>Colour Preference</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {(["Black & Grey", "Colour", "Not Sure"] as const).map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setValue("color_preference", col)}
                  className={cn(
                    "rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer text-center",
                    selectedColour === col
                      ? "border-amber-500/80 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/10"
                      : "border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white"
                  )}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: SERVICE TYPE */}
        {/* ========================================================================= */}
        <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <MapPin size={16} className="text-amber-400" />
            <span>3. Service Selection</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Option A: Studio Visit */}
            <button
              type="button"
              onClick={() => setValue("service_type", "Visit Artist")}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer",
                selectedServiceType === "Visit Artist"
                  ? "border-amber-500/70 bg-gradient-to-b from-amber-500/20 via-ink-900 to-ink-950 ring-2 ring-amber-400/30"
                  : "border-white/10 bg-ink-950/60 hover:border-white/20 opacity-80"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-amber-300">Option 1</span>
                <MapPin size={16} className="text-amber-400" />
              </div>
              <p className="font-display font-bold text-white text-base">Visit Artist Studio</p>
              <p className="text-xs text-ink-300 mt-1">
                At-Post Bhadam, Rajpipla, Narmada. Quiet 1-on-1 private suite.
              </p>
            </button>

            {/* Option B: Home Tattoo Service */}
            <button
              type="button"
              onClick={() => setValue("service_type", "Home Tattoo Service")}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer",
                selectedServiceType === "Home Tattoo Service"
                  ? "border-emerald-500/70 bg-gradient-to-b from-emerald-500/20 via-ink-900 to-ink-950 ring-2 ring-emerald-400/30"
                  : "border-white/10 bg-ink-950/60 hover:border-white/20 opacity-80"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-emerald-400">Option 2 · VIP</span>
                <Home size={16} className="text-emerald-400" />
              </div>
              <p className="font-display font-bold text-white text-base">Home Tattoo Service</p>
              <p className="text-xs text-ink-300 mt-1">
                Jainik visits your house in Rajpipla, Vadodara, Surat, Bharuch or across Gujarat.
              </p>
            </button>
          </div>

          <div>
            <label className="label">
              {selectedServiceType === "Home Tattoo Service"
                ? "Your Full Address & City for Home Visit *"
                : "Your City / Town (Where you are traveling from) *"}
            </label>
            <input
              {...register("city_or_address")}
              placeholder={
                selectedServiceType === "Home Tattoo Service"
                  ? "e.g. 102 Krishna Heights, Alkapuri, Vadodara"
                  : "e.g. Rajpipla, Vadodara, Surat, Bharuch"
              }
              className="input-field"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: APPOINTMENT SCHEDULE */}
        {/* ========================================================================= */}
        <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <CalendarIcon size={16} className="text-amber-400" />
            <span>4. Appointment Schedule</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Preferred Date *</label>
              <input
                type="date"
                min={getMinBookingDate(0)}
                {...register("preferred_date")}
                className="input-field [color-scheme:dark]"
              />
              {errors.preferred_date && (
                <p className="mt-1 text-xs text-red-400">{errors.preferred_date.message}</p>
              )}
            </div>

            <div>
              <label className="label">Alternative Date (Optional)</label>
              <input
                type="date"
                min={getMinBookingDate(0)}
                {...register("alternative_date")}
                className="input-field [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="label">Preferred Time Slot</label>
              <select {...register("preferred_time")} className="input-field">
                <option value="10:00 AM" className="bg-ink-900 text-white">10:00 AM (Morning)</option>
                <option value="11:00 AM" className="bg-ink-900 text-white">11:00 AM</option>
                <option value="02:00 PM" className="bg-ink-900 text-white">02:00 PM (Afternoon)</option>
                <option value="04:00 PM" className="bg-ink-900 text-white">04:00 PM</option>
                <option value="06:00 PM" className="bg-ink-900 text-white">06:00 PM (Evening)</option>
                <option value="Flexible / Anytime" className="bg-ink-900 text-white">Flexible / Anytime</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: ADDITIONAL INFORMATION & REFERENCES */}
        {/* ========================================================================= */}
        <div className="glass-card p-6 sm:p-8 border-white/15 space-y-5">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <ImageIcon size={16} className="text-amber-400" />
            <span>5. Additional Details &amp; Reference Photos</span>
          </h3>

          <div>
            <label className="label">Detailed Description / Custom Requests (Optional)</label>
            <textarea
              {...register("detailed_description")}
              rows={2}
              placeholder="Any specific symbolism, lettering names, skin sensitivities, or sizing requirements..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Reference Image URL (Optional)</label>
            <input
              {...register("reference_image_url")}
              placeholder="e.g. Pinterest or Instagram link: https://pin.it/..."
              className="input-field"
            />
          </div>

          {/* Photo Upload Attachment Box */}
          <div className="pt-2 space-y-3">
            <label className="label flex items-center justify-between">
              <span>Or Upload Photo References (Screenshots / Inspiration)</span>
              <span className="text-[10px] text-ink-400">Optional</span>
            </label>

            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-ink-950/60 p-6 text-center cursor-pointer hover:border-amber-400/50 hover:bg-white/5 transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="font-semibold text-xs text-white mt-2">
                Click to attach reference photos
              </p>
              <p className="text-[11px] text-ink-400 mt-0.5">
                Supports PNG, JPG, WEBP screenshots
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {referenceImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                {referenceImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/20 bg-ink-950 group"
                  >
                    <img src={imgUrl} alt={`Ref ${idx + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white text-[10px] hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBMIT BUTTON WITH ANTI-DUPLICATE PROTECTION */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "btn-primary w-full py-4 text-base font-bold shadow-2xl shadow-brand/40 flex items-center justify-center gap-2 transition-all cursor-pointer",
              submitting ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Submitting enquiry...</span>
              </div>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Submit Tattoo Enquiry &rarr;</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-ink-400">
            By submitting, you agree to our{" "}
            <Link href="/privacy" className="text-amber-300 hover:underline">
              Privacy Policy
            </Link>
            . Your information is strictly used for booking and consultation purposes.
          </p>
        </div>
      </form>
    </main>
  );
}

export function BookingClient() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen py-24 text-center text-ink-400">Loading booking portal...</div>}>
        <EnquiryFormInner />
      </Suspense>
      <Footer />
    </>
  );
}
