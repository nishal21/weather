import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";
import type { LocationRef } from "@/lib/weather/types";
import { hrefForLocation } from "@/lib/geo/location-url";

const defaultOg = {
  title: `${SITE.name} – ${SITE.tagline}`,
  description:
    "Built in India. Made for the world. Live forecasts, air quality, and clear weather alerts.",
  images: [
    {
      url: "/og.jpg",
      width: 1734,
      height: 907,
      alt: `${SITE.name} – ${SITE.tagline}`,
    },
  ],
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – Live forecast & clear alerts`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.maintainer, url: SITE.maintainerUrl }],
  creator: SITE.maintainer,
  publisher: SITE.name,
  category: "weather",
  keywords: [...SITE.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: defaultOg.title,
    description: defaultOg.description,
    images: defaultOg.images,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultOg.title,
    description: defaultOg.description,
    images: ["/og.jpg"],
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: "black-translucent",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "code-repository": SITE.repository,
    license: SITE.license,
  },
};

export function welcomeMetadata(): Metadata {
  return {
    title: `${SITE.name} – ${SITE.tagline}`,
    description: SITE.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: defaultOg.title,
      description: SITE.description,
      url: "/",
    },
  };
}

export function locationMetadata(location: LocationRef): Metadata {
  const placeLine = location.state
    ? `${location.name}, ${location.state}`
    : location.name;
  const title = `Weather in ${placeLine}`;
  const description = `Live weather in ${placeLine}. Hourly and 7-day forecast, rain, wind, UV, air quality, and alerts.`;
  const path = hrefForLocation(location);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
    },
    twitter: {
      title: `${title} | ${SITE.name}`,
      description,
    },
    other: {
      "geo.placename": placeLine,
      "geo.position": `${location.lat};${location.lon}`,
      ICBM: `${location.lat}, ${location.lon}`,
    },
  };
}

export function errorMetadata(): Metadata {
  return {
    title: "Weather unavailable",
    description:
      "Could not load live weather. Search for your city and try again.",
    robots: { index: false, follow: true },
  };
}
