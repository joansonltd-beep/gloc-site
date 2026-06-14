import { createClient, type SanityClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

// Lazily-created read client. Building it on first use (not at module load)
// means an unconfigured/invalid project never instantiates a client during the
// build. The data layer only calls this when isSanityConfigured is true.
let cached: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!cached) {
    cached = createClient({
      projectId: projectId || "placeholder",
      dataset,
      apiVersion,
      useCdn: true,
    });
  }
  return cached;
}
