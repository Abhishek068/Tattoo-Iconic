import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tattooiconic.in";
  const currentDate = new Date().toISOString();

  const routes = [
    { url: `${baseUrl}`, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/styles`, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/portfolio`, changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/booking`, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/reviews`, changeFrequency: "daily" as const, priority: 0.85 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${baseUrl}/aftercare`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/artists`, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${baseUrl}/flash`, changeFrequency: "weekly" as const, priority: 0.85 },
  ];

  return routes.map((route) => ({
    url: route.url,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
