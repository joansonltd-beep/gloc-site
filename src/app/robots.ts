import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/studio", "/api", "/brochures", "/wait"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
