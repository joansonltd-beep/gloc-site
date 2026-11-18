import catalogue from "@/lib/public-insurers.json";
import type { MetadataRoute } from "next";
import { LINE_DETAILS } from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  // /brochures is deliberately excluded: it is noindexed and blocked in robots.
  const topRoutes = ["", "/protect", "/grow", "/business", "/personal-solutions", "/business-solutions", "/tools", "/about", "/contact", "/book", "/privacy"];
  const lineRoutes = LINE_DETAILS.map((d) => `/${d.clusterKey}/${d.slug}`);
  return [...topRoutes, ...lineRoutes, "/insurers", ...catalogue.carriers.map(c=>`/insurers/${c.slug}`)].map((path) => ({
    url: `${SITE_URL}${path}`,
    // Omit lastModified until an actual content modification date is available.
    // A rebuild alone does not mean every page changed.
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
