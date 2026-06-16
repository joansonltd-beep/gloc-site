import type { MetadataRoute } from "next";
import { LINE_DETAILS } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const topRoutes = ["", "/protect", "/grow", "/assets", "/business", "/about", "/book"];
  const lineRoutes = LINE_DETAILS.map((d) => `/${d.clusterKey}/${d.slug}`);
  const now = new Date();
  return [...topRoutes, ...lineRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
