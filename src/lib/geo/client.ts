import type { LocationRef } from "@/lib/weather/types";
import {
  hrefForLocation,
  parseFromCode,
  parsePlaceParam,
  roundCoord,
  hasPlaceInQuery,
  isNearYouQuery,
  type LocationQueryParams,
  type PlaceFromCode,
} from "./location-url";
import { LOCALE_STORAGE, LOCALE_STORAGE_LEGACY, resolveLanguage } from "@/lib/i18n/locale";
import { getLocalStorageMigrating } from "@/lib/storage/migrate-local";
import {
  persistLastPlace,
  readLastPlaceFromStorage,
} from "./last-place";

export {
  hrefForLocation,
  parseFromCode,
  parsePlaceParam,
  roundCoord,
  hasPlaceInQuery,
  isNearYouQuery,
  type LocationQueryParams,
  type PlaceFromCode,
};

export {
  readSavedPlaces,
  savePlace,
  removeSavedPlace,
  toggleSavedPlace,
  isPlaceSaved,
} from "./saved-places";

export {
  persistLastPlace,
  readLastPlaceFromStorage,
  syncLastPlaceCookieFromStorage,
} from "./last-place";

const DENIED_KEY = "straten:geo-denied";
const DENIED_KEY_LEGACY = "india-weather:geo-denied";

/** @deprecated use persistLastPlace */
export function saveLastPlace(loc: LocationRef) {
  persistLastPlace(loc);
}

/** @deprecated use readLastPlaceFromStorage */
export function readLastPlace(): LocationRef | null {
  return readLastPlaceFromStorage();
}

export function setGeoDenied(denied: boolean) {
  try {
    if (denied) {
      localStorage.setItem(DENIED_KEY, "1");
      localStorage.removeItem(DENIED_KEY_LEGACY);
    } else {
      localStorage.removeItem(DENIED_KEY);
      localStorage.removeItem(DENIED_KEY_LEGACY);
    }
  } catch {
    /* ignore */
  }
}

export function wasGeoDenied(): boolean {
  try {
    return getLocalStorageMigrating(DENIED_KEY, DENIED_KEY_LEGACY) === "1";
  } catch {
    return false;
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12_000,
      maximumAge: 120_000,
    });
  });
}

export async function queryGeoPermission(): Promise<PermissionState | "unknown"> {
  try {
    if (!navigator.permissions?.query) return "unknown";
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state;
  } catch {
    return "unknown";
  }
}

export async function locateUserPlace(): Promise<LocationRef> {
  const pos = await getCurrentPosition();
  const { latitude, longitude } = pos.coords;
  const lat = roundCoord(latitude);
  const lon = roundCoord(longitude);
  let lang = "en";
  try {
    lang = resolveLanguage(
      getLocalStorageMigrating(LOCALE_STORAGE, LOCALE_STORAGE_LEGACY),
    );
  } catch {
    /* ignore */
  }
  const res = await fetch(`/api/places/reverse?lat=${lat}&lon=${lon}&lang=${lang}`);
  const place = (await res.json()) as LocationRef;
  return {
    ...place,
    lat,
    lon,
    id: place.id || `gps-${lat}-${lon}`,
  };
}
