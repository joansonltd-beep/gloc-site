import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/studio", "/api", "/brochures", "/wait"] },
      { userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'], disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
