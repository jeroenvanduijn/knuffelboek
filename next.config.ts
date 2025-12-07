import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'smt0i9fnjglr6owb.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
