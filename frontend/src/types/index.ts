// ── Users & Artist ──
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "client" | "artist" | "admin";
  avatar: string | null;
  date_joined: string;
}

export interface ArtistProfile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  experience_years: number;
  years_of_experience?: number;
  studio_name: string;
  location_summary: string;
  specialties: string[];
  awards: string[];
  instagram_handle: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  profile_image: string;
  studio_image: string;
  hourly_rate: number;
  minimum_deposit: number;
  is_accepting_bookings: boolean;
  offers_home_service: boolean;
  home_service_radius: string;
  booking_lead_days: number;
  stats: {
    pieces_completed: string;
    experience: string;
    rating: number;
    reviews_count: string;
    healed_rate: string;
  };
}

// ── Portfolio & Video Reels ──
export type TattooStyle =
  | "All"
  | "Fine Line"
  | "Blackwork"
  | "Realism"
  | "Minimalist"
  | "Traditional"
  | "Custom";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  healed_image: string | null;
  video_url?: string;
  style_tags: string[];
  primary_style: string;
  placement: string;
  size?: string;
  color_type: "Black & Grey" | "Color" | "Single Needle" | "Mixed";
  session_hours: number | null;
  is_featured: boolean;
  is_published: boolean;
  artist_name: string;
  artist_id: string;
  created_at: string;
  client_story?: string;
}

export interface VideoReel {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  views?: string;
  style: string;
  description: string;
}

// ── Pinterest & Instagram Inspiration Items ──
export interface InspirationItem {
  id: string;
  title: string;
  description: string;
  image: string;
  source: "instagram" | "pinterest" | "studio" | "web";
  source_url?: string;
  instagram_permalink?: string;
  instagram_likes?: string;
  instagram_comments?: string;
  style_tags: string[];
  primary_style: string;
  placement: string;
  aspect_ratio?: "tall" | "square" | "portrait" | "wide";
  artist_credit?: string;
  is_trending?: boolean;
}

export interface InstagramPostItem {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  video_url?: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  permalink: string;
  timestamp: string;
  like_count?: number | string;
  comments_count?: number | string;
  style_tag?: string;
  style_tags?: string[];
  placement?: string;
  is_reel?: boolean;
}

export interface MoodboardItem {
  id: string;
  item_id: string;
  title: string;
  image: string;
  style: string;
  placement: string;
  source: string;
  saved_at: string;
}

// ── Services ──
export interface ServiceOffering {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  full_desc: string;
  suitable_for: string[];
  process_steps: string[];
  estimated_duration: string;
  price_model: "Fixed Starting" | "Hourly" | "Price on Consultation";
  starting_price?: number;
  hourly_rate?: number;
  service_type: "studio" | "home" | "consultation";
  image: string;
  icon: string;
  features: string[];
}

// ── Bookings & Appointments ──
export type BookingStatus =
  | "pending"
  | "accepted"
  | "deposit_required"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "rejected"
  | "cancelled";

export type ServiceType = "studio_visit" | "home_service" | "consultation";

export interface BookingRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  whatsapp_preferred?: boolean;
  
  // Step 1: Tattoo Details
  tattoo_description: string;
  tattoo_style: string;
  placement: string;
  approx_size: string;
  color_preference?: "Black & Grey" | "Color" | "Undecided" | string;
  
  // Step 2: Reference Images
  reference_images: string[];
  
  // Step 3 & 4: Service Mode & Location
  service_type: ServiceType;
  address?: string;
  home_address?: {
    street: string;
    city: string;
    postcode: string;
    notes?: string;
  };
  
  // Step 5: Schedule
  preferred_date: string;
  preferred_time: string;
  alternative_date?: string;
  
  // Step 6: Additional Notes
  additional_notes?: string;
  
  // Status & Metadata
  status: BookingStatus;
  estimated_price?: number;
  deposit_amount: number;
  deposit_paid: boolean;
  artist_notes?: string;
  created_at: string;
  updated_at?: string;

  // Compatibility fields for dashboard
  client_name?: string;
  client_email?: string;
  artist_name?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  duration?: number | string;
  style?: string;
  size?: string;
  total_price?: number;
  description?: string;
  client?: { id: string; name: string; email: string };
}

export interface AvailabilitySlot {
  date: string;
  available_slots: string[];
  is_blocked: boolean;
  blocked_reason?: string;
}

// ── Reviews ──
export interface ReviewItem {
  id: string;
  client_name: string;
  client_location: string;
  rating: number;
  service_type: "Studio Visit" | "Home Service" | "Custom Project";
  tattoo_piece: string;
  style: string;
  healed_time: string;
  comment: string;
  client_avatar?: string;
  healed_photo?: string;
  healed_video?: string;
  photos?: string[];
  created_at: string;
  is_verified: boolean;
}

// ── Calendar Event ──
export interface CalendarEvent {
  id: string;
  booking_id?: string;
  title: string;
  customer_name: string;
  service_type: ServiceType;
  start: string; // ISO string
  end: string;   // ISO string
  status: BookingStatus;
  placement: string;
  location_summary: string;
  is_home_service: boolean;
}

// ── Customers / Clients ──
export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  total_bookings: number;
  last_booking_date: string;
  preferred_style: string;
  notes: string;
  status: "active" | "vip" | "new";
}

// ── API & Generic ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Aliases & Backward Compatibility ──
export type Availability = AvailabilitySlot;
export type Review = ReviewItem;

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  artist_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: string | number;
  style: string;
  placement: string;
  size: string;
  total_price?: number;
  deposit_amount: number;
  artist_notes?: string;
  description?: string;
  status: BookingStatus | "in_progress";
  deposit_paid?: boolean;
  client: string;
  created_at: string;
  client_info?: any;
  service_type?: any;
  design_details?: any;
  schedule_preferences?: any;
  budget_deposit?: any;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  content?: string;
  cover_image?: string;
  author_name: string;
  tags: string[];
  reading_time_minutes?: number;
  created_at: string;
  published_at: string;
  status?: "draft" | "published";
}

export interface FlashDesign {
  id: string;
  title: string;
  description?: string;
  image: string;
  style?: string;
  style_tags: string[];
  price: number;
  deposit_amount?: number;
  is_claimed?: boolean;
  is_available?: boolean;
  is_one_of_one?: boolean;
  artist_id?: string;
  artist_name: string;
  size_recommendation?: string;
  placement_recommendation?: string[];
  created_at: string;
}

