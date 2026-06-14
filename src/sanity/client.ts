import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

// Read-only client for fetching content into the site.
// useCdn for fast cached reads; the data layer revalidates periodically.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});
