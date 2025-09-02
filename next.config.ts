import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // Supabase local port
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Production Supabase
      },
    ],
  },
};

export default nextConfig;
