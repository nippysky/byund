import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BYUND — Infrastructure You Can Trust",
    short_name: "BYUND",
    description:
      "The modern platform for IT governance, asset ownership tracking, and audit readiness.",
    start_url: "/",
    display: "standalone",
    background_color: "#050609",
    theme_color: "#7260fb",
    orientation: "portrait-primary",
    categories: ["productivity", "business", "utilities"],
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/byund-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
