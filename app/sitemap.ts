import { MetadataRoute } from "next";

const BASE = "https://byund.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Core marketing
    { url: BASE,               lastModified: now, changeFrequency: "weekly",  priority: 1.0  },
    { url: `${BASE}/governance`, lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${BASE}/company`,  lastModified: now, changeFrequency: "monthly", priority: 0.7  },

    // Company pages
    { url: `${BASE}/careers`,  lastModified: now, changeFrequency: "weekly",  priority: 0.65 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.6  },

    // Legal
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3  },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3  },
    { url: `${BASE}/security`, lastModified: now, changeFrequency: "monthly", priority: 0.4  },

    // Auth (low priority — not for crawling content, but exist)
    { url: `${BASE}/signin`,   lastModified: now, changeFrequency: "yearly",  priority: 0.2  },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "yearly",  priority: 0.2  },
  ];
}
