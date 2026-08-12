"use client";

import type { DailyForecast, WeatherCondition } from "@/lib/weather/types";
import { formatWeekdayShort } from "@/lib/format/localized-units";
import { GlassCard, PanelTitle } from "@/components/weather/GlassCard";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import {
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Wind,
} from "@phosphor-icons/react";

function MiniIcon({ condition }: { condition: WeatherCondition }) {
  const cls = "size-5";
  switch (condition) {
    case "clear":
    case "heatwave":
      return <Sun className={`${cls} text-amber-200`} weight="fill" />;
    case "partly_cloudy":
      return <CloudSun className={`${cls} text-white`} weight="fill" />;
    case "fog":
    case "haze":
    case "overcast":
      return <CloudFog className={`${cls} text-white/90`} weight="fill" />;
    case "light_rain":
      return <CloudRain className={`${cls} text-sky-200`} weight="fill" />;
    case "heavy_rain":
    case "thunderstorm":
      return <CloudLightning className={`${cls} text-violet-200`} weight="fill" />;
    case "snow":
      return <CloudSnow className={`${cls} text-sky-100`} weight="fill" />;
    case "windy":
      return <Wind className={`${cls} text-teal-100`} weight="fill" />;
    default:
      return <CloudSun className={`${cls} text-white`} weight="fill" />;
  }
}

function dayLabel(
  date: string,
  index: number,
  locale: string,
  t: (key: "day.today" | "day.tomorrow") => string,
): string {
  if (index === 0) return t("day.today");
  if (index === 1) return t("day.tomorrow");
  return formatWeekdayShort(date, locale);
}

type Props = {
  daily: DailyForecast[];
};

const ROW =
  "grid grid-cols-[minmax(4.75rem,34%)_1.5rem_2.25rem_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:grid-cols-[minmax(5.25rem,32%)_1.75rem_2.5rem_minmax(0,1fr)] sm:gap-x-2.5";

export function DailyForecastList({ daily }: Props) {
  const { locale } = useLocale();
  const t = useT();
  const days = daily.slice(0, 7);
  if (days.length === 0) return null;

  const weekLow = Math.min(...days.map((d) => d.minTempC));
  const weekHigh = Math.max(...days.map((d) => d.maxTempC));
  const span = Math.max(weekHigh - weekLow, 1);

  return (
    <GlassCard aria-label={t("panel.daily")} className="card-rise h-full">
      <PanelTitle>{t("panel.daily")}</PanelTitle>
      <p className="mt-1 line-clamp-3 break-words text-[12px] leading-snug text-white/50">
        {t("panel.daily.rangeHelp")}
      </p>

      <div className={`mt-3 ${ROW}`} aria-hidden>
        <span />
        <span />
        <span className="truncate text-right text-[10px] text-sky-200/70">
          {t("panel.daily.rainLabel")}
        </span>
        <div className="min-w-0 text-[10px] tabular-nums text-white/40">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">{t("panel.daily.low")}</span>
            <span className="truncate text-right">{t("panel.daily.high")}</span>
          </div>
          <p className="sr-only">{t("panel.daily.thisWeek")}</p>
        </div>
      </div>

      <ul className="mt-1">
        {days.map((d, i) => {
          const left = ((d.minTempC - weekLow) / span) * 100;
          const width = ((d.maxTempC - d.minTempC) / span) * 100;
          const lo = Math.round(d.minTempC);
          const hi = Math.round(d.maxTempC);
          const label = dayLabel(d.date, i, locale, t);
          return (
            <li key={d.date} className={`${ROW} py-2.5 sm:py-3`}>
              <span className="truncate text-sm font-medium text-white/90">
                {label}
              </span>
              <span className="flex items-center justify-center">
                <MiniIcon condition={d.condition} />
              </span>
              <span className="text-right text-[11px] tabular-nums text-sky-200/85">
                {d.rainChancePct != null ? `${d.rainChancePct}%` : ""}
              </span>
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-white/45">
                  {lo}°
                </span>
                <div
                  className="temp-range-track min-w-0 flex-1"
                  role="img"
                  aria-label={`${label}: ${lo}° to ${hi}°`}
                >
                  <div
                    className="temp-range-fill"
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 10)}%`,
                    }}
                  />
                </div>
                <span className="w-7 shrink-0 text-[11px] font-semibold tabular-nums text-white">
                  {hi}°
                </span>
              </div>
              <span className="sr-only">{d.conditionLabel}</span>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
