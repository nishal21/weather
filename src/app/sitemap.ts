import type { MetadataRoute } from "next";
import { hrefForLocation } from "@/lib/geo/location-url";
import { INDIA_QUICK_CITIES } from "@/lib/weather/locations/india-cities";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/"),
    lastModified: now,
    changeFrequency: "hourly",
    priority: 1,
  };

  const cities: MetadataRoute.Sitemap = INDIA_QUICK_CITIES.map((city) => ({
    url: absoluteUrl(hrefForLocation(city)),
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.85,
  }));

  return [home, ...cities];
}
