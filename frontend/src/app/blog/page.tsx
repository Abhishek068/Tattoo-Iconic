import type { Metadata } from "next";
import { BlogClient } from "@/components/pages/BlogClient";

export const metadata: Metadata = {
  title: "Tattoo Art Insights & Studio Blog | Tattoo Iconic",
  description:
    "Read articles on tattoo design ideas, meaning of sacred symbols, pain management, aftercare techniques, and studio news by Master Artist Jainik Patel.",
  keywords: [
    "tattoo blog Gujarat",
    "tattoo care advice",
    "spiritual tattoo meaning",
    "Tattoo Iconic news",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/blog",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
