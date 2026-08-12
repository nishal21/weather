import type { MetadataRoute } from "next";
import { hrefForLocation } from "@/lib/geo/location-url";
import { INDIA_QUICK_CITIES } from "@/lib/weather/locations/india-cities";
import { WORLD_CITIES } from "@/lib/weather/locations/world-cities";
import { sitemapLoc } from "@/lib/seo/site";
import type { LocationRef } from "@/lib/weather/types";

function dedupeCities(cities: LocationRef[]): LocationRef[] {
  const seen = new Set<string>();
  const out: LocationRef[] = [];
  for (const city of cities) {
    const key = `${city.countryCode}:${city.lat.toFixed(3)},${city.lon.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(city);
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: sitemapLoc("/"),
    lastModified: now,
    changeFrequency: "hourly",
    priority: 1,
  };

  const india = dedupeCities(INDIA_QUICK_CITIES).map((city) => ({
    url: sitemapLoc(hrefForLocation(city)),
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.85,
  }));

  const world = dedupeCities(WORLD_CITIES).map((city) => ({
    url: sitemapLoc(hrefForLocation(city)),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [home, ...india, ...world];
}
