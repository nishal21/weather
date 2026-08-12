import "server-only";

import { cookies } from "next/headers";
import type { LocationRef } from "@/lib/weather/types";
import { LAST_PLACE_COOKIE, parseLastPlaceJson } from "./last-place";

export async function readLastPlaceCookie(): Promise<LocationRef | null> {
  const jar = await cookies();
  const raw = jar.get(LAST_PLACE_COOKIE)?.value;
  if (!raw) return null;

  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  return parseLastPlaceJson(decoded);
}
