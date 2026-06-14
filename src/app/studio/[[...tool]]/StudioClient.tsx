"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Client-only wrapper. Keeping the Studio config import inside a "use client"
// component stops Studio code (which calls React.createContext at module load)
// from being evaluated in the server bundle during build (Turbopack).
export default function StudioClient() {
  return <NextStudio config={config} />;
}
