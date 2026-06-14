// Sanity environment config.
// projectId/dataset come from env so nothing is hardcoded (spec.md §3, §11).
// When no project is configured the site falls back to bundled default content,
// so it always runs even before Sanity is set up.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

// True once a real project id is set. Data layer uses this to decide whether
// to query Sanity or use the bundled defaults.
export const isSanityConfigured = projectId.length > 0;
