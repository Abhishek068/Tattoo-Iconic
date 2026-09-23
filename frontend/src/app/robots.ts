import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tattooiconic.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/artist-dashboard/", "/artist-access", "/dashboard/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/artist-dashboard/", "/artist-access", "/dashboard/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
