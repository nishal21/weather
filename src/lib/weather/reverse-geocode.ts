import type { LocationRef } from "@/lib/weather/types";
import {
  bigDataCloudLanguage,
  type AppLocale,
} from "@/lib/i18n/locale";

interface BigDataCloudReverse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryCode?: string;
  localityInfo?: {
    administrative?: { name: string; adminLevel: number }[];
  };
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  locale: AppLocale = "en",
): Promise<LocationRef> {
  const lang = bigDataCloudLanguage(locale);
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Reverse geocode HTTP ${res.status}`);
  }
  const data = (await res.json()) as BigDataCloudReverse;
  const name =
    data.city ||
    data.locality ||
    data.localityInfo?.administrative?.find((a) => a.adminLevel >= 5)?.name ||
    "Near you";
  const state = data.principalSubdivision || "";
  const countryCode = (data.countryCode || "IN").toUpperCase();

  return {
    id: `gps-${lat.toFixed(4)}-${lon.toFixed(4)}`,
    name,
    state,
    countryCode,
    lat,
    lon,
  };
}
