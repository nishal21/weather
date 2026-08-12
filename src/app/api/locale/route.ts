import { NextRequest, NextResponse } from "next/server";
import { normalizeLanguageCode } from "@/lib/i18n/locale";
import { translateOnline } from "@/lib/i18n/translate-online";
import { UI_SOURCE, type UiKey } from "@/lib/i18n/ui-source";

export async function GET(req: NextRequest) {
  const locale = normalizeLanguageCode(req.nextUrl.searchParams.get("lang"));
  const entries = Object.entries(UI_SOURCE) as [UiKey, string][];

  if (locale === "en") {
    return NextResponse.json(
      { locale, strings: UI_SOURCE },
      { headers: { "Cache-Control": "public, s-maxage=3600" } },
    );
  }

  const strings = {} as Record<UiKey, string>;
  await Promise.all(
    entries.map(async ([key, value]) => {
      strings[key] = await translateOnline(value, locale);
    }),
  );

  return NextResponse.json(
    { locale, strings },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600",
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
