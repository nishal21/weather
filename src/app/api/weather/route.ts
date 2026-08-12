import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherSnapshot } from "@/lib/weather/provider";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    const snapshot = await fetchWeatherSnapshot({
      p: sp.get("p") ?? undefined,
      n: sp.get("n") ?? undefined,
      st: sp.get("st") ?? undefined,
      f: sp.get("f") ?? undefined,
      cc: sp.get("cc") ?? undefined,
      l: sp.get("l") ?? undefined,
      location: sp.get("location") ?? undefined,
      lat: sp.get("lat") ?? undefined,
      lon: sp.get("lon") ?? undefined,
      name: sp.get("name") ?? undefined,
      state: sp.get("state") ?? undefined,
      q: sp.get("q") ?? undefined,
      from: sp.get("from") ?? undefined,
    });
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to load live weather. Try again in a moment." },
      { status: 502 },
    );
  }
}
