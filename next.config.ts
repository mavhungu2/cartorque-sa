import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
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
