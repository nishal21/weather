import type { LocationRef } from "./types";

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

interface GeoResponse {
  results?: GeoResult[];
}

export async function searchPlaces(
  query: string,
  opts?: { countryCode?: string; count?: number; language?: string },
): Promise<LocationRef[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const params = new URLSearchParams({
    name: q,
    count: String(opts?.count ?? 12),
    language: opts?.language ?? "en",
    format: "json",
  });
  if (opts?.countryCode) {
    params.set("countryCode", opts.countryCode);
  }

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) {
    throw new Error(`Geocoding HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeoResponse;
  return (data.results ?? []).map((r) => ({
    id: `om-${r.id}`,
    name: r.name,
    state: r.admin1 ?? r.admin2 ?? "",
    district: r.admin2,
    countryCode: (r.country_code ?? "").toUpperCase(),
    lat: r.latitude,
    lon: r.longitude,
  }));
}
