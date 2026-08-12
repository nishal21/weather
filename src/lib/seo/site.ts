/** Site config for SEO, OpenGraph, sitemap, and AI crawlers. */
import { publicEnv } from "@/lib/env/public";

export const SITE = {
  name: "India Weather",
  shortName: "Weather",
  tagline: "Weather for India and beyond",
  description:
    "Live weather for cities in India and around the world. Hourly and 7-day forecasts, rain, wind, UV, air quality, and short alerts you can use.",
  locale: "en_IN",
  country: "IN",
  url: publicEnv.siteUrl,
  repository: "https://github.com/nishal21/weather",
  repositoryGit: "https://github.com/nishal21/weather.git",
  maintainer: "nishal21",
  maintainerUrl: "https://github.com/nishal21",
  license: "MPL-2.0",
  licenseUrl: "https://www.mozilla.org/MPL/2.0/",
  twitter: "@indiaweather",
  keywords: [
    "India weather",
    "weather forecast India",
    "live weather",
    "hourly forecast",
    "7 day forecast",
    "rain forecast",
    "air quality index",
    "UV index",
    "weather alerts",
    "Malayalam weather",
    "Hindi weather",
    "world weather",
    "city weather search",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
