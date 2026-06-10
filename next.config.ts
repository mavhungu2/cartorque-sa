import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Cap how long CDN edges may serve a stale ISR page while revalidating.
  // Default is ~1 year of stale-while-revalidate, which let deleted listings
  // linger on cached copies of the home page. 5 minutes is plenty.
  expireTime: 300,
  // Tell Turbopack this directory is the workspace root, suppressing the
  // multi-lockfile inference warning caused by a sibling package-lock.json.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // Mock listing photos (Unsplash) — can be removed once real Storage URLs are in use.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Firebase Storage (Phase 2)
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
