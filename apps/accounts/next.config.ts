import type { NextConfig } from "next";

const config: NextConfig = {
  ...(!process.env.VERCEL && {
    turbopack: {
      root: __dirname,
    },
  }),
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
