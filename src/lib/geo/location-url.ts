import type { LocationRef } from "@/lib/weather/types";

/** ~11 m precision — enough for weather, keeps URLs short. */
export function roundCoord(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

export function parsePlaceParam(
  p: string | null | undefined,
): { lat: number; lon: number } | null {
  if (!p?.trim()) return null;
  const [latStr, lonStr] = p.split(",");
  const lat = Number(latStr?.trim());
  const lon = Number(lonStr?.trim());
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

export type PlaceFromCode = "gps" | "search" | "saved";

export function parseFromCode(
  code: string | null | undefined,
): PlaceFromCode | undefined {
  if (code === "g") return "gps";
  if (code === "s") return "search";
  if (code === "v") return "saved";
  return undefined;
}

export function fromCode(from: PlaceFromCode | undefined): string | undefined {
  if (from === "gps") return "g";
  if (from === "search") return "s";
  if (from === "saved") return "v";
  return undefined;
}

export type LocationQueryParams = {
  /** Compact `lat,lon` (4 decimal places). */
  p?: string;
  /** Place name. */
  n?: string;
  /** State / region. */
  st?: string;
  /** Source: g | s | v */
  f?: string;
  /** Country code when not IN. */
  cc?: string;
  /** India quick-city slug (legacy id without `in-`). */
  l?: string;
  /** Legacy params */
  location?: string;
  lat?: string;
  lon?: string;
  name?: string;
  state?: string;
  q?: string;
  from?: string;
};

export function hasPlaceInQuery(q: LocationQueryParams): boolean {
  return Boolean(
    parsePlaceParam(q.p) ||
      (q.lat && q.lon) ||
      q.location ||
      q.l ||
      (q.q && q.q.trim().length >= 2),
  );
}

export function isNearYouQuery(q: LocationQueryParams): boolean {
  return q.f === "g" || q.from === "gps";
}

/** Normalize compact + legacy query shapes for `resolveLocation`. */
export function normalizeLocationQuery(
  query: LocationQueryParams,
): LocationQueryParams {
  const compact = parsePlaceParam(query.p);
  const fromLegacy =
    query.from === "gps"
      ? "g"
      : query.from === "search"
        ? "s"
        : query.from === "saved"
          ? "v"
          : undefined;

  return {
    ...query,
    lat: compact ? String(compact.lat) : query.lat,
    lon: compact ? String(compact.lon) : query.lon,
    name: query.n?.trim() || query.name,
    state: query.st?.trim() || query.state,
    f: query.f || fromLegacy,
    location:
      query.l && !query.location ? `in-${query.l}` : query.location,
  };
}

export function hrefForLocation(
  loc: LocationRef,
  opts?: { from?: PlaceFromCode },
): string {
  const lat = roundCoord(loc.lat);
  const lon = roundCoord(loc.lon);
  const p = new URLSearchParams();
  p.set("p", `${lat},${lon}`);

  const name = loc.name?.trim();
  if (name && name !== "Near you" && name !== "Selected place") {
    p.set("n", name);
  }
  if (loc.state?.trim()) p.set("st", loc.state.trim());
  if (loc.countryCode && loc.countryCode !== "IN") {
    p.set("cc", loc.countryCode);
  }
  if (loc.id.startsWith("in-")) p.set("l", loc.id.slice(3));

  const fc = fromCode(opts?.from);
  if (fc) p.set("f", fc);

  return `/?${p.toString()}`;
}

export function locationRefFromQuery(
  query: LocationQueryParams,
): LocationRef | null {
  const q = normalizeLocationQuery(query);
  const compact = parsePlaceParam(q.p);
  const lat = compact?.lat ?? Number(q.lat);
  const lon = compact?.lon ?? Number(q.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return {
    id:
      q.location ||
      (q.l ? `in-${q.l}` : null) ||
      `coord-${roundCoord(lat)}-${roundCoord(lon)}`,
    name: q.name?.trim() || "Selected place",
    state: q.state?.trim() || "",
    countryCode: q.cc?.trim().toUpperCase() || "IN",
    lat: roundCoord(lat),
    lon: roundCoord(lon),
  };
}
