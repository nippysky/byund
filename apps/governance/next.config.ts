import type { NextConfig } from "next";

const config: NextConfig = {
  // Silence multiple-lockfiles warning — governance is standalone inside the monorepo
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default config;
