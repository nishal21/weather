import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isProduction, serverEnv } from "@/lib/env/server";
import { normalizeLanguageCode } from "@/lib/i18n/locale";

const MAX_SEARCH_LEN = 80;

function allowedHosts(): Set<string> {
  const hosts = new Set<string>(["localhost:3000", "127.0.0.1:3000"]);
  if (serverEnv.siteUrl) {
    try {
      hosts.add(new URL(serverEnv.siteUrl).host);
    } catch {
      /* ignore invalid URL */
    }
  }
  return hosts;
}

/** Block cross-site abuse of /api routes in production. */
export function assertApiCallerAllowed(req: NextRequest): NextResponse | null {
  if (!isProduction()) return null;

  const host = req.headers.get("host");
  if (!host || !allowedHosts().has(host)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return null;
}

export function parseBoundedLatLon(
  latRaw: string | null,
  lonRaw: string | null,
): { lat: number; lon: number } | null {
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

export function sanitizeSearchQuery(raw: string | null | undefined): string {
  return (raw ?? "").trim().slice(0, MAX_SEARCH_LEN);
}

export function sanitizeLang(raw: string | null | undefined): string {
  return normalizeLanguageCode(raw);
}

export function apiError(message: string, status = 502): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
