import type { LocationRef } from "@/lib/weather/types";
import { roundCoord } from "./location-url";

const STORAGE_KEY = "india-weather:saved-places";
const MAX_SAVED = 8;

export function placeStorageKey(loc: LocationRef): string {
  return `${roundCoord(loc.lat)},${roundCoord(loc.lon)}`;
}

export function readSavedPlaces(): LocationRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocationRef[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) =>
        typeof p?.lat === "number" &&
        typeof p?.lon === "number" &&
        typeof p?.name === "string",
    );
  } catch {
    return [];
  }
}

function writeSavedPlaces(places: LocationRef[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places.slice(0, MAX_SAVED)));
    dispatchSavedPlacesChanged();
  } catch {
    /* ignore */
  }
}

export function dispatchSavedPlacesChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("saved-places-changed"));
}

export function isPlaceSaved(loc: LocationRef): boolean {
  const key = placeStorageKey(loc);
  return readSavedPlaces().some((p) => placeStorageKey(p) === key);
}

/** Adds place to the top of saved list. Returns false if already saved or full. */
export function savePlace(loc: LocationRef): boolean {
  const places = readSavedPlaces();
  const key = placeStorageKey(loc);
  if (places.some((p) => placeStorageKey(p) === key)) return false;
  if (places.length >= MAX_SAVED) {
    writeSavedPlaces([loc, ...places.slice(0, MAX_SAVED - 1)]);
    return true;
  }
  writeSavedPlaces([loc, ...places]);
  return true;
}

export function removeSavedPlace(loc: LocationRef): void {
  const key = placeStorageKey(loc);
  writeSavedPlaces(readSavedPlaces().filter((p) => placeStorageKey(p) !== key));
}

/** @returns true if saved after toggle, false if removed */
export function toggleSavedPlace(loc: LocationRef): boolean {
  if (isPlaceSaved(loc)) {
    removeSavedPlace(loc);
    return false;
  }
  savePlace(loc);
  return true;
}
