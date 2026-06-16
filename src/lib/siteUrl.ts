// Canonical site URL used for SEO (sitemap, robots, canonical/OG URLs).
// Defaults to the live domain so search engines always get real URLs, even if
// the NEXT_PUBLIC_SITE_URL env var isn't set. Override via that env var.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.joansonbjames.com"
).replace(/\/$/, "");
