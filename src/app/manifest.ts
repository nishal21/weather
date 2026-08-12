import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#070b12",
    orientation: "portrait-primary",
    categories: ["weather", "utilities"],
    lang: "en-IN",
    icons: [
      {
        src: SITE.logo,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: SITE.logo,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
