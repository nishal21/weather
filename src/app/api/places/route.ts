import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/weather/geocoding";
import { INDIA_QUICK_CITIES } from "@/lib/weather/locations/india-cities";
import { openMeteoLanguage, resolveLanguage } from "@/lib/i18n/locale";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const country = req.nextUrl.searchParams.get("country") ?? "IN";
  const scope = req.nextUrl.searchParams.get("scope") ?? "world"; // in | world
  const locale = resolveLanguage(req.nextUrl.searchParams.get("lang"));

  try {
    if (!q) {
      return NextResponse.json({
        results: scope === "world" ? [] : INDIA_QUICK_CITIES.slice(0, 12),
      });
    }

    const results = await searchPlaces(q, {
      countryCode: scope === "world" ? undefined : country,
      count: 20,
      language: openMeteoLanguage(locale),
    });

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600" } },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
