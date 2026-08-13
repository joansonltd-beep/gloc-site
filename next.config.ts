import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimizing images served from the Sanity asset CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async rewrites() {
    return [
      // Serve the standalone market-survey funnel (public/survey.html) at a
      // clean URL. It has its own self-contained design, so it lives outside
      // the site layout.
      { source: "/survey", destination: "/survey.html" },
    ];
  },
};

export default nextConfig;
