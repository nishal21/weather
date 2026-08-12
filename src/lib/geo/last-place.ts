import type { LocationRef } from "@/lib/weather/types";

export const LAST_PLACE_STORAGE_KEY = "india-weather:last-place";
export const LAST_PLACE_COOKIE = "weather_last_place";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export function isValidLocationRef(value: unknown): value is LocationRef {
  if (!value || typeof value !== "object") return false;
  const loc = value as LocationRef;
  return (
    typeof loc.lat === "number" &&
    Number.isFinite(loc.lat) &&
    typeof loc.lon === "number" &&
    Number.isFinite(loc.lon) &&
    typeof loc.name === "string" &&
    loc.name.trim().length > 0
  );
}

export function parseLastPlaceJson(raw: string | null | undefined): LocationRef | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as LocationRef;
    if (!isValidLocationRef(parsed)) return null;
    return {
      ...parsed,
      id: parsed.id || `coord-${parsed.lat}-${parsed.lon}`,
      state: parsed.state ?? "",
      countryCode: parsed.countryCode?.trim().toUpperCase() || "IN",
    };
  } catch {
    return null;
  }
}

export function serializeLastPlace(loc: LocationRef): string {
  return JSON.stringify(loc);
}

/** Client-only: persist last opened place for the next visit. */
export function persistLastPlace(loc: LocationRef): void {
  if (typeof window === "undefined") return;
  const payload = serializeLastPlace(loc);
  try {
    localStorage.setItem(LAST_PLACE_STORAGE_KEY, payload);
  } catch {
    /* ignore */
  }
  try {
    const encoded = encodeURIComponent(payload);
    document.cookie = `${LAST_PLACE_COOKIE}=${encoded}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

/** Client-only: read cached last place from localStorage. */
export function readLastPlaceFromStorage(): LocationRef | null {
  if (typeof window === "undefined") return null;
  try {
    return parseLastPlaceJson(localStorage.getItem(LAST_PLACE_STORAGE_KEY));
  } catch {
    return null;
  }
}

/** Client-only: backfill cookie when older sessions only used localStorage. */
export function syncLastPlaceCookieFromStorage(): void {
  const saved = readLastPlaceFromStorage();
  if (!saved) return;
  persistLastPlace(saved);
}
