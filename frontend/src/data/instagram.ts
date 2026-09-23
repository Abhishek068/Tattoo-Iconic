import type { InstagramPostItem } from "@/types";

export interface InstagramDashboardData {
  account: {
    handle: string;
    artist_name: string;
    phone: string;
    studio: string;
    location: string;
    token_status: "CONNECTED" | "DISCONNECTED" | "EXPIRED";
    account_type: "CREATOR" | "BUSINESS";
  };
  stats: {
    total_imported: number;
    pending_review: number;
    published_count: number;
    failed_count: number;
    hidden_count: number;
    last_sync_at: string;
    last_sync_status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
  };
  pending_items: Array<{
    id: string;
    instagram_media_id: string;
    instagram_permalink: string;
    title: string;
    caption: string;
    media_type: string;
    published_at: string;
    imported_at: string;
    color_type: string;
    ai_suggested_style: string;
    ai_suggested_placement: string;
    ai_suggested_tags: string;
    ai_confidence_score: number;
    like_count: number;
    comments_count: number;
    media_items: Array<{
      id: string;
      source_url: string;
      storage_url: string;
      thumbnail_url: string;
      media_type: string;
    }>;
  }>;
  sync_history: Array<{
    id: string;
    started_at: string;
    completed_at: string | null;
    total_processed: number;
    imported_count: number;
    skipped_count: number;
    failed_count: number;
    status: "COMPLETED" | "IN_PROGRESS" | "FAILED" | "PARTIAL";
    log_details: Record<string, any>;
  }>;
}

export const INITIAL_INSTAGRAM_POSTS: InstagramPostItem[] = [
  {
    id: "ig-1",
    media_url: "/images/tattoos/shiva-trishul-tattoo.jpg",
    thumbnail_url: "/images/tattoos/shiva-trishul-tattoo.jpg",
    caption: "Devotional Lord Shiva Trishul & Damru forearm piece with sacred Rudraksha beads. Inked at @tatoo.iconic studio in Bhadam #TattooIconic #ShivaTrishul #Mahadev",
    media_type: "IMAGE",
    permalink: "https://www.instagram.com/tatoo.iconic",
    timestamp: "2026-08-14T10:00:00Z",
    like_count: "4.9k",
    comments_count: 182,
    style_tag: "Spiritual",
    style_tags: ["Spiritual", "Dark Realism"],
    placement: "Forearm",
    is_reel: false,
  },
  {
    id: "ig-2",
    media_url: "/images/tattoos/hanuman-tattoo.jpg",
    thumbnail_url: "/images/tattoos/hanuman-tattoo.jpg",
    caption: "Lord Hanuman Panchamukhi Kavach with Sanskrit Shloka calligraphy #HanumanKavach #SpiritualTattoo #JainikPatel",
    media_type: "IMAGE",
    permalink: "https://www.instagram.com/tatoo.iconic",
    timestamp: "2026-08-10T12:30:00Z",
    like_count: "5.4k",
    comments_count: 240,
    style_tag: "Spiritual",
    style_tags: ["Spiritual", "Fine Line"],
    placement: "Bicep",
    is_reel: false,
  },
  {
    id: "ig-3",
    media_url: "/images/tattoos/lotus-mandala-tattoo.jpg",
    thumbnail_url: "/images/tattoos/lotus-mandala-tattoo.jpg",
    caption: "Micro fine-line Lotus Mandala down the spine. Single needle precision #FineLineTattoo #Mandala #LotusTattoo",
    media_type: "IMAGE",
    permalink: "https://www.instagram.com/tatoo.iconic",
    timestamp: "2026-07-28T15:00:00Z",
    like_count: "3.8k",
    comments_count: 95,
    style_tag: "Fine Line",
    style_tags: ["Fine Line", "Geometric"],
    placement: "Spine",
    is_reel: false,
  },
  {
    id: "ig-4",
    media_url: "/images/tattoos/lion-king-tattoo.jpg",
    thumbnail_url: "/images/tattoos/lion-king-tattoo.jpg",
    caption: "Royal Lion King with Imperial Crown dark realism #LionTattoo #DarkRealism #TattooArtistGujarat",
    media_type: "IMAGE",
    permalink: "https://www.instagram.com/tatoo.iconic",
    timestamp: "2026-07-15T09:45:00Z",
    like_count: "6.2k",
    comments_count: 310,
    style_tag: "Realism",
    style_tags: ["Realism", "Dark Realism"],
    placement: "Forearm",
    is_reel: false,
  },
];

export const INITIAL_INSTAGRAM_DASHBOARD: InstagramDashboardData = {
  account: {
    handle: "@tatoo.iconic",
    artist_name: "Jainik Patel",
    phone: "+918238767100",
    studio: "Tattoo Iconic",
    location: "At-Post Bhadam, Taluka- Rajpipla, District- Narmada, Gujarat",
    token_status: "CONNECTED",
    account_type: "CREATOR",
  },
  stats: {
    total_imported: 2461,
    pending_review: 2,
    published_count: 2459,
    failed_count: 0,
    hidden_count: 0,
    last_sync_at: "2026-09-22T10:15:00Z",
    last_sync_status: "COMPLETED",
  },
  pending_items: [
    {
      id: "pending-1",
      instagram_media_id: "ig-pend-101",
      instagram_permalink: "https://www.instagram.com/tatoo.iconic",
      title: "Lord Shiva Trishul & Sacred Damru Cosmic Flow",
      caption: "Devotional Lord Shiva Trishul piece with sacred Rudraksha and Damru #Mahadev #ShivaTrishul #ForearmTattoo",
      media_type: "IMAGE",
      published_at: "2026-09-21T18:00:00Z",
      imported_at: "2026-09-22T08:00:00Z",
      color_type: "Black & Grey",
      ai_suggested_style: "Spiritual",
      ai_suggested_placement: "Forearm",
      ai_suggested_tags: "Mahadev, ShivaTrishul, Spiritual",
      ai_confidence_score: 0.96,
      like_count: 4950,
      comments_count: 180,
      media_items: [
        {
          id: "m-1",
          source_url: "/images/tattoos/shiva-trishul-tattoo.jpg",
          storage_url: "/images/tattoos/shiva-trishul-tattoo.jpg",
          thumbnail_url: "/images/tattoos/shiva-trishul-tattoo.jpg",
          media_type: "IMAGE",
        },
      ],
    },
    {
      id: "pending-2",
      instagram_media_id: "ig-pend-102",
      instagram_permalink: "https://www.instagram.com/tatoo.iconic",
      title: "Royal Lion & Imperial Crown Dark Realism",
      caption: "King Lion with royal crown dark realism on bicep #DarkRealism #LionKing #TattooIconic",
      media_type: "IMAGE",
      published_at: "2026-09-20T19:30:00Z",
      imported_at: "2026-09-22T08:00:00Z",
      color_type: "Black & Grey",
      ai_suggested_style: "Realism",
      ai_suggested_placement: "Bicep",
      ai_suggested_tags: "DarkRealism, LionKing, Realism",
      ai_confidence_score: 0.92,
      like_count: 3820,
      comments_count: 140,
      media_items: [
        {
          id: "m-2",
          source_url: "/images/tattoos/lion-king-tattoo.jpg",
          storage_url: "/images/tattoos/lion-king-tattoo.jpg",
          thumbnail_url: "/images/tattoos/lion-king-tattoo.jpg",
          media_type: "IMAGE",
        },
      ],
    },
  ],
  sync_history: [
    {
      id: "batch-1",
      started_at: "2026-09-22T10:14:00Z",
      completed_at: "2026-09-22T10:15:00Z",
      total_processed: 24,
      imported_count: 22,
      skipped_count: 2,
      failed_count: 0,
      status: "COMPLETED",
      log_details: { sync_source: "mock_curated_feed", profile: "@tatoo.iconic" },
    },
  ],
};
