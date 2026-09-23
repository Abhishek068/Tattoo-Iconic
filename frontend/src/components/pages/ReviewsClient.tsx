"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Play,
  Film,
  MapPin,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { reviewService } from "@/services/reviewService";
import type { ReviewItem } from "@/types";
import toast from "react-hot-toast";

export function ReviewsClient() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filterType, setFilterType] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);

  // Leave a review form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [piece, setPiece] = useState("");
  const [service, setService] = useState<ReviewItem["service_type"]>("Studio Visit");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [healedTime, setHealedTime] = useState("Healed 1 month");

  // Uploaded media files
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  // Active Lightbox Modal (For viewing enlarged review photos or playing videos)
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: "image" | "video"; title: string } | null>(null);

  useEffect(() => {
    reviewService.getReviews(filterType).then(setReviews);
  }, [filterType]);

  // Handle Photo & Video Upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setUploadedPhotos((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setUploadedVideos((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload an image (PNG, JPG) or video (MP4, WEBM).");
      }
    });
    toast.success("Media attached to your review!");
  };

  const removePhoto = (idxToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const removeVideo = (idxToRemove: number) => {
    setUploadedVideos((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !comment || !piece) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const newRev = await reviewService.submitReview({
      client_name: name,
      client_location: location || "Rajpipla, Gujarat",
      rating,
      service_type: service,
      tattoo_piece: piece,
      style: "Custom Inking",
      healed_time: healedTime,
      comment,
      healed_photo: uploadedPhotos[0] || undefined,
      photos: uploadedPhotos,
      healed_video: uploadedVideos[0] || undefined,
    });

    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    toast.success("Thank you for submitting your verified client review!");

    // Reset Form
    setName("");
    setLocation("");
    setComment("");
    setPiece("");
    setUploadedPhotos([]);
    setUploadedVideos([]);
  }

  return (
    <>
      <Navbar />

      <main className="container-hero pt-28 sm:pt-36 pb-16 sm:pb-20 space-y-16">
        {/* Header & Rating Breakdown Banner */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
              Customer Reviews
            </h1>
            <p className="text-sm sm:text-base text-ink-300 max-w-xl leading-relaxed">
              Authentic reviews, healed tattoo photos, and video testimonials from clients who experienced private studio sessions in Bhadam, Rajpipla and luxury mobile home visits across Gujarat with Jainik Patel.
            </p>
          </div>

          {/* Rating Scorecard */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 border-amber-500/30 text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-display text-5xl font-bold text-white">5.0</span>
              <div className="text-left pl-3 border-l border-white/10">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-1">Based on 380+ Healed Reviews</p>
              </div>
            </div>

            <p className="text-xs text-emerald-400 font-medium">
              100% Client Satisfaction &amp; Hospital-Grade Sterile Standards
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-xs sm:text-sm py-3 px-5 w-full flex items-center justify-center gap-2 shadow-xl shadow-brand/30 hover:scale-[1.02] transition-transform"
            >
              <Plus size={16} />
              <span>+ Leave a Client Review (With Photo / Video)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Studio Visit", "Home Service", "Custom Project"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${filterType === tab
                    ? "bg-gradient-to-r from-amber-500 to-brand text-white shadow-md shadow-brand/20 border border-amber-300/30"
                    : "border border-white/10 bg-white/5 text-ink-300 hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-ink-400 hidden sm:inline">
            Showing {reviews.length} verified reviews
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all p-6 bg-gradient-to-b from-ink-900/90 via-surface-card to-ink-950"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    {rev.healed_time}
                  </span>
                </div>

                <p className="text-xs font-bold text-amber-300">
                  {rev.tattoo_piece}
                </p>

                <p className="text-xs sm:text-sm text-ink-200 leading-relaxed italic">
                  “{rev.comment}”
                </p>

                {/* ── Photo Media Render ── */}
                {rev.healed_photo && (
                  <div
                    onClick={() => setLightboxMedia({ url: rev.healed_photo!, type: "image", title: rev.tattoo_piece })}
                    className="relative aspect-video rounded-xl overflow-hidden mt-3 border border-white/15 bg-ink-950 cursor-pointer group shadow-md"
                  >
                    <Image
                      src={rev.healed_photo}
                      alt={`${rev.tattoo_piece} healed tattoo`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                        Click to Zoom
                      </span>
                    </div>
                  </div>
                )}

                {/* ── Video Media Render ── */}
                {rev.healed_video && (
                  <div
                    onClick={() => setLightboxMedia({ url: rev.healed_video!, type: "video", title: `${rev.tattoo_piece} Video` })}
                    className="relative aspect-video rounded-xl overflow-hidden mt-3 border border-amber-500/30 bg-ink-950 cursor-pointer group shadow-md flex items-center justify-center"
                  >
                    <video
                      src={rev.healed_video}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-ink-950 shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={20} className="fill-ink-950 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Film size={10} /> Video Review
                    </span>
                  </div>
                )}
              </div>

              {/* Client Info Bar */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white flex items-center gap-1">
                    <span>{rev.client_name}</span>
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  </p>
                  <p className="text-[10px] text-ink-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    <span>{rev.client_location}</span>
                  </p>
                </div>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
                  {rev.service_type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* LEAVE A REVIEW MODAL WITH PHOTO & VIDEO UPLOADS */}
        {/* ========================================================================= */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-xl w-full rounded-3xl border border-white/20 bg-ink-900 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-2xl text-white font-bold">
                    Leave a Client Review
                  </h3>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Share your experience with Jainik Patel &amp; upload your healed tattoo photos or videos.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-white/10 p-2 text-ink-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4 text-left">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Your Full Name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Your City / Location *</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Rajpipla, Vadodara, Surat"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Service Mode *</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value as any)}
                      className="input-field"
                    >
                      <option value="Studio Visit">Studio Visit (Bhadam Atelier)</option>
                      <option value="Home Service">Luxury Home Service</option>
                      <option value="Custom Project">Custom Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Healed Timeframe</label>
                    <select
                      value={healedTime}
                      onChange={(e) => setHealedTime(e.target.value)}
                      className="input-field"
                    >
                      <option value="Fresh Tattoo">Fresh Tattoo (Day 1-3)</option>
                      <option value="Healed 2 weeks">Healed 2 weeks</option>
                      <option value="Healed 1 month">Healed 1 month</option>
                      <option value="Healed 3+ months">Healed 3+ months</option>
                      <option value="Healed 1+ year">Healed 1+ year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Tattoo Artwork Name / Subject *</label>
                  <input
                    value={piece}
                    onChange={(e) => setPiece(e.target.value)}
                    placeholder="e.g. Lord Hanuman Ji Forearm / Mahadev Trishul / Royal Lion Sleeve"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Your Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${rating >= s
                            ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/10"
                            : "border-white/10 bg-white/5 text-ink-500"
                          }`}
                      >
                        ★ {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Your Review &amp; Experience *</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Describe your session with Jainik, hygiene standards, painless inking, and healed sharpness..."
                    className="input-field"
                    required
                  />
                </div>

                {/* ── PHOTO & VIDEO UPLOAD SECTION ── */}
                <div className="space-y-3 pt-2">
                  <label className="label flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Sparkles size={14} className="text-amber-400" />
                      Upload Tattoo Photo / Video
                    </span>
                    <span className="text-[10px] text-amber-300 font-normal">Photos &amp; Videos Supported</span>
                  </label>

                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-ink-950/60 p-5 text-center cursor-pointer hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                        <ImageIcon size={20} />
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                        <VideoIcon size={20} />
                      </div>
                    </div>
                    <p className="font-semibold text-xs text-white mt-2">
                      Click to upload photos or videos of your tattoo
                    </p>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      Supports JPG, PNG, WEBP and MP4, WEBM videos
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Previews Grid for Photos */}
                  {uploadedPhotos.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                        Attached Photos ({uploadedPhotos.length})
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {uploadedPhotos.map((photoUrl, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/20 bg-ink-950 group">
                            <img src={photoUrl} alt={`Review photo ${idx + 1}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previews Grid for Videos */}
                  {uploadedVideos.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                        Attached Videos ({uploadedVideos.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedVideos.map((videoUrl, idx) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/40 bg-ink-950 group">
                            <video src={videoUrl} className="h-full w-full object-cover" muted />
                            <button
                              type="button"
                              onClick={() => removeVideo(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow"
                            >
                              <Trash2 size={10} />
                            </button>
                            <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] text-white">
                              Video {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-secondary text-xs py-3 px-4"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs py-3 px-7 shadow-xl shadow-brand/30">
                    Publish Verified Review &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LIGHTBOX FOR FULLSCREEN PHOTO & VIDEO PREVIEW */}
        {/* ========================================================================= */}
        {lightboxMedia && (
          <div
            onClick={() => setLightboxMedia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden border border-white/20 bg-ink-950 p-3 sm:p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between px-2">
                <span className="font-display font-bold text-white text-base">
                  {lightboxMedia.title}
                </span>
                <button
                  onClick={() => setLightboxMedia(null)}
                  className="rounded-full bg-white/10 p-2 text-ink-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                {lightboxMedia.type === "image" ? (
                  <img
                    src={lightboxMedia.url}
                    alt={lightboxMedia.title || "Client Healed Tattoo Review"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <video
                    src={lightboxMedia.url}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
