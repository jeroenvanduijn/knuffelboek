import type { NextConfig } from "next";
import { myBooksUrl } from "./src/lib/constants";

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
    // "Mijn boeken" bestaat alleen in de app; de site heeft geen eigen login.
    // ?view=mijn-boeken laat de app meteen dat scherm (of het inlogvenster) openen.
    return [
      { source: '/mijn-boeken', destination: myBooksUrl('redirect'), permanent: false },
      { source: '/mijn-boeken/:path*', destination: myBooksUrl('redirect'), permanent: false },
    ];
  },
};

export default nextConfig;
