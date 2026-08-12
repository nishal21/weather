import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  HSTS_HEADER,
  SECURITY_HEADER_MAP,
} from "@/lib/security/headers";
import { LAST_PLACE_COOKIE, parseLastPlaceJson } from "@/lib/geo/last-place";
import { hrefForLocation } from "@/lib/geo/location-url";
import { seoBotHtml } from "@/lib/seo/bot-shell";

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
  return /bot|crawl|slurp|spider|facebookexternalhit|facebot|linkedinbot|twitterbot|discordbot|whatsapp|telegrambot|embedly|iframely|metatags|opengraph|preview|quora link preview|showyoubot|outbrain|pinterest|redditbot|slackbot|vkshare|w3c_validator|googleother|lighthouse|pagespeed|gtmetrix|semrush|ahrefs|rogerbot|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|qwantify|xing-contenttabreceiver|developer\.pinterest/i.test(
    ua,
  );
}

function withSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADER_MAP)) {
    response.headers.set(key, value);
  }
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;

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

    // OG/SEO scanners only need meta tags — skip cold Next.js render.
    if (isShareOrSeoBot(request.headers.get("user-agent") ?? "")) {
      const response = new NextResponse(seoBotHtml(), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
      return withSecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  withSecurityHeaders(response);

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store");
  } else if (
    request.method === "GET" &&
    url.pathname === "/" &&
    !requestHasPlace(url) &&
    !request.cookies.get(LAST_PLACE_COOKIE)
  ) {
    // Cache empty welcome HTML briefly for everyone (no personalization).
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=600",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest|json|mp4|webm)$).*)",
  ],
};
