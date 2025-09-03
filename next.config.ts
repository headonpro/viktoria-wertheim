import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
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
