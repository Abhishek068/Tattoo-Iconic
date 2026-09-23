export interface Review3DItem {
  id: string;
  name: string;
  rating: number;
  review: string;
  tattooPiece?: string;
  location?: string;
  avatar?: string;
  verified?: boolean;
  date?: string;
  styleAccent?: "gold" | "obsidian" | "sapphire" | "emerald" | "bronze";
}

export const CLIENT_REVIEWS_3D: Review3DItem[] = [
  {
    id: "rev-3d-1",
    name: "James",
    rating: 5,
    review:
      "Amazing experience from start to finish. The tattoo came out even better than I imagined.",
    tattooPiece: "Lord Shiva Realism Sleeve",
    location: "Vadodara, Gujarat",
    avatar: "/images/avatars/avatar-1.jpg",
    verified: true,
    date: "August 2026",
    styleAccent: "gold",
  },
  {
    id: "rev-3d-2",
    name: "Sophie",
    rating: 5,
    review:
      "Very professional artist and an incredible attention to detail.",
    tattooPiece: "Fine-Line Sacred Lotus Mandala",
    location: "Rajpipla, Gujarat",
    avatar: "/images/avatars/avatar-2.jpg",
    verified: true,
    date: "July 2026",
    styleAccent: "emerald",
  },
  {
    id: "rev-3d-3",
    name: "Ryan",
    rating: 5,
    review:
      "Absolutely love my tattoo. The design and shading are perfect.",
    tattooPiece: "Imperial Lion King Dark Realism",
    location: "Surat, Gujarat",
    avatar: "/images/avatars/avatar-3.jpg",
    verified: true,
    date: "August 2026",
    styleAccent: "sapphire",
  },
  {
    id: "rev-3d-4",
    name: "Mia",
    rating: 5,
    review:
      "Great atmosphere, friendly service and fantastic artwork.",
    tattooPiece: "Micro-Realism Collarbone Feather",
    location: "Ahmedabad, Gujarat",
    avatar: "/images/avatars/avatar-4.jpg",
    verified: true,
    date: "September 2026",
    styleAccent: "bronze",
  },
  {
    id: "rev-3d-5",
    name: "Daniel",
    rating: 5,
    review:
      "Would definitely recommend Tattoo Iconic. Brilliant work.",
    tattooPiece: "Sanskrit Devotional Calligraphy",
    location: "Bharuch, Gujarat",
    avatar: "/images/avatars/avatar-5.jpg",
    verified: true,
    date: "July 2026",
    styleAccent: "obsidian",
  },
  {
    id: "rev-3d-6",
    name: "Rahul Solanki",
    rating: 5,
    review:
      "The depth of the Trishul and sacred Rudraksha beads looks like a 3D sculpture on my forearm. The hygiene at the studio is unmatched.",
    tattooPiece: "Lord Shiva Trishul & Damru",
    location: "Vadodara, Gujarat",
    avatar: "/images/avatars/avatar-6.jpg",
    verified: true,
    date: "June 2026",
    styleAccent: "gold",
  },
  {
    id: "rev-3d-7",
    name: "Meera Trivedi",
    rating: 5,
    review:
      "The luxury home tattoo service was absolutely unmatched! Zero pain, crisp single-needle lines, and totally comfortable experience.",
    tattooPiece: "Spine Trail Sacred Geometry",
    location: "Rajpipla, Gujarat",
    avatar: "/images/avatars/avatar-7.jpg",
    verified: true,
    date: "May 2026",
    styleAccent: "emerald",
  },
  {
    id: "rev-3d-8",
    name: "Aarav Patel",
    rating: 5,
    review:
      "8 months later, the healed fine lines are as crisp as day one. Jainik is truly the premier solo tattoo master in Gujarat.",
    tattooPiece: "Lord Hanuman Ji Spiritual Arm",
    location: "Surat, Gujarat",
    avatar: "/images/avatars/avatar-8.jpg",
    verified: true,
    date: "July 2026",
    styleAccent: "gold",
  },
];
