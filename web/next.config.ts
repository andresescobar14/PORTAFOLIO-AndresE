import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Allow the LAN address used to test this portfolio on other devices.
  allowedDevOrigins: ['192.168.0.110'],
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/icons/:path*', headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ] }, { source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
