import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    disableDevLogs: true,
    runtimeCaching: [
      // Cache OpenStreetMap tiles
      {
        urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "osm-tiles",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Cache API marker data
      {
        urlPattern: /\/api\/markers.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-markers",
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 }, // 5 min
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Cache GeoJSON campus layers
      {
        urlPattern: /\/geojson\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "geojson-layers",
          expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Transpile Leaflet for SSR compatibility
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default pwaConfig(nextConfig);
