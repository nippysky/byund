import { MetadataRoute } from "next";

const BASE = "https://byund.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block internal app routes from indexing
        disallow: [
          "/dashboard/",
          "/onboarding/",
          "/api/",
          "/_next/",
        ],
      },
      {
        // Block AI training crawlers
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
