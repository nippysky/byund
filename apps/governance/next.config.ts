import type { NextConfig } from "next";

const config: NextConfig = {
  // turbopack.root silences the multiple-lockfiles warning in local dev.
  // On Vercel, outputFileTracingRoot is set automatically — don't override it.
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
