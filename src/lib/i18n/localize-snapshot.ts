import type { AppLocale } from "./locale";
import { translateOnline } from "./translate-online";
import type {
  AlertActionTip,
  WeatherSnapshot,
} from "@/lib/weather/types";
import { wmoConditionLabel } from "@/lib/weather/wmo";
import { daySummary } from "@/lib/format/day-summary";

/** Localize forecast labels using Open-Meteo WMO table + MyMemory for narrative text. */
export async function localizeWeatherSnapshot(
  snapshot: WeatherSnapshot,
  locale: AppLocale,
): Promise<WeatherSnapshot> {
  if (locale === "en") return snapshot;

  const cur = snapshot.current;
  cur.conditionLabel = await translateOnline(
    wmoConditionLabel(cur.wmoCode ?? 0),
    locale,
  );
  if (cur.condition === "heatwave") {
    cur.conditionLabel = await translateOnline("Heatwave conditions", locale);
  }

  for (const h of snapshot.hourly48) {
    h.conditionLabel = await translateOnline(
      wmoConditionLabel(h.wmoCode ?? 0),
      locale,
    );
  }
  for (const d of snapshot.forecast7) {
    d.conditionLabel = await translateOnline(
      wmoConditionLabel(d.wmoCode ?? 0),
      locale,
    );
  }

  return snapshot;
}

export async function localizeAlertsCopy(
  alerts: WeatherSnapshot["alerts"],
  tips: AlertActionTip[],
  locale: AppLocale,
) {
  if (locale === "en") return { alerts, tips };
  const outAlerts = await Promise.all(
    alerts.map(async (a) => ({
      ...a,
      title: await translateOnline(a.title, locale),
      summary: await translateOnline(a.summary, locale),
    })),
  );
  const outTips = await Promise.all(
    tips.map(async (t) => ({
      ...t,
      text: await translateOnline(t.text, locale),
    })),
  );
  return { alerts: outAlerts, tips: outTips };
}

export async function localizeDaySummaryText(
  snapshot: WeatherSnapshot,
  locale: AppLocale,
): Promise<string> {
  const raw = daySummary(snapshot.current, snapshot.forecast7[0]);
  return locale === "en" ? raw : translateOnline(raw, locale);
}
