// Sanity environment config.
// projectId/dataset come from env so nothing is hardcoded (spec.md §3, §11).
// Values are trimmed and validated so a blank or malformed env var (e.g. an
// empty dataset pasted into Vercel) can never crash the build — we just fall
// back to the bundled default content.

const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "").trim();
const rawDataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "").trim();
const rawApiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "").trim();

// Sanity project ids are lowercase alphanumeric. Anything else => treat as unset.
export const projectId = /^[a-z0-9]+$/.test(rawProjectId) ? rawProjectId : "";

// Datasets: lowercase letters, numbers, underscores, dashes (optional leading ~),
// max 64 chars. Anything else (including empty) => "production".
export const dataset = /^~?[a-z0-9_-]{1,64}$/.test(rawDataset)
  ? rawDataset
  : "production";

export const apiVersion = rawApiVersion || "2024-10-01";

// True only when a valid project id is present. Drives the data-layer fallback.
export const isSanityConfigured = projectId.length > 0;
