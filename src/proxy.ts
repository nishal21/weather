import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  HSTS_HEADER,
  SECURITY_HEADER_MAP,
} from "@/lib/security/headers";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADER_MAP)) {
    response.headers.set(key, value);
  }

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest|json|mp4|webm)$).*)",
  ],
};
