import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  HSTS_HEADER,
  SECURITY_HEADER_MAP,
} from "@/lib/security/headers";
import { LAST_PLACE_COOKIE, parseLastPlaceJson } from "@/lib/geo/last-place";
import { hrefForLocation } from "@/lib/geo/location-url";

function requestHasPlace(url: URL): boolean {
  const q = url.searchParams;
  const freeText = q.get("q")?.trim() ?? "";
  return Boolean(
    q.get("p") ||
      (q.get("lat") && q.get("lon")) ||
      q.get("location") ||
      q.get("l") ||
      freeText.length >= 2,
  );
}

function readLastPlaceFromRequest(request: NextRequest) {
  const raw = request.cookies.get(LAST_PLACE_COOKIE)?.value;
  if (!raw) return null;
  try {
    return parseLastPlaceJson(decodeURIComponent(raw));
  } catch {
    return parseLastPlaceJson(raw);
  }
}

function isShareOrSeoBot(ua: string): boolean {
  return /bot|crawl|slurp|spider|facebookexternalhit|facebot|linkedinbot|twitterbot|discordbot|whatsapp|telegrambot|embedly|quora link preview|showyoubot|outbrain|pinterest|redditbot|slackbot|vkshare|w3c_validator|googleother/i.test(
    ua,
  );
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Keep last-place redirects out of the React page so `/` can avoid cookies().
  if (
    request.method === "GET" &&
    url.pathname === "/" &&
    !requestHasPlace(url)
  ) {
    const cached = readLastPlaceFromRequest(request);
    if (cached) {
      const target = hrefForLocation(cached, { from: "saved" });
      return NextResponse.redirect(new URL(target, url));
    }
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADER_MAP)) {
    response.headers.set(key, value);
  }

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store");
  } else if (
    request.method === "GET" &&
    url.pathname === "/" &&
    !requestHasPlace(url) &&
    !request.cookies.get(LAST_PLACE_COOKIE) &&
    isShareOrSeoBot(request.headers.get("user-agent") ?? "")
  ) {
    // Let Netlify/Cloudflare cache the welcome HTML for crawlers measuring TTFB.
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=120, stale-while-revalidate=600",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest|json|mp4|webm)$).*)",
  ],
};
