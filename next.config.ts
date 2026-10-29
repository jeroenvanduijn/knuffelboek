import type { NextConfig } from "next";
import { appUrl } from "./src/lib/constants";

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
  async redirects() {
    // "Mijn boeken" bestaat alleen in de app (knop rechtsboven); de site heeft geen eigen login.
    return [
      { source: '/mijn-boeken', destination: appUrl('redirect', 'mijn-boeken'), permanent: false },
      { source: '/mijn-boeken/:path*', destination: appUrl('redirect', 'mijn-boeken'), permanent: false },
    ];
  },
};

export default nextConfig;
