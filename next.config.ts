import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimizing images served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
