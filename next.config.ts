import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/ideas",
        destination: "https://suitmedia-backend.suitdev.com/api/ideas",
      },
    ];
  },
  images: {
    domains: ["assets.suitdev.com", "suitmedia-backend.suitdev.com"],
  },
};

export default nextConfig;
