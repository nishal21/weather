"use client";

import { useState } from "react";
import type { DailyForecast, HourlyForecast, WeatherCondition } from "@/lib/weather/types";
import { formatIstDate, formatIstTime } from "@/lib/format/units";
import {
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Moon,
  Wind,
} from "@phosphor-icons/react";

function MiniIcon({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const cls = "size-6";
  switch (condition) {
    case "clear":
      return isDay ? (
        <Sun className={`${cls} text-amber-200`} weight="fill" />
      ) : (
        <Moon className={`${cls} text-slate-100`} weight="fill" />
      );
    case "partly_cloudy":
      return isDay ? (
        <CloudSun className={`${cls} text-white`} weight="fill" />
      ) : (
        <CloudMoon className={`${cls} text-white`} weight="fill" />
      );
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

type Props = {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isDay?: boolean;
};

export function ForecastPanel({ hourly, daily, isDay = true }: Props) {
  const [mode, setMode] = useState<"hourly" | "weekly">("hourly");
  const hours = hourly.slice(0, 24);
  const days = daily.slice(0, 7);

  return (
    <section className="rounded-[1.5rem] bg-white/12 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          {mode === "hourly" ? "Hourly forecast" : "7-day forecast"}
        </h2>
        <div
          className="flex rounded-full bg-black/25 p-1"
          role="tablist"
          aria-label="Forecast range"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "hourly"}
            className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition ${
              mode === "hourly"
                ? "bg-white/20 text-white"
                : "text-white/55 hover:text-white/80"
            }`}
            onClick={() => setMode("hourly")}
          >
            Hourly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "weekly"}
            className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition ${
              mode === "weekly"
                ? "bg-white/20 text-white"
                : "text-white/55 hover:text-white/80"
            }`}
            onClick={() => setMode("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>

      {mode === "hourly" ? (
        <ul className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hours.map((h) => (
            <li
              key={h.time}
              className="flex w-[4.25rem] shrink-0 flex-col items-center gap-2 rounded-2xl bg-black/20 px-2 py-3"
            >
              <span className="text-[11px] font-medium text-white/60">
                {formatIstTime(h.time)}
              </span>
              <MiniIcon condition={h.condition} isDay={isDay} />
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(h.temperatureC)}°
              </span>
              {h.precipitationProbabilityPct != null ? (
                <span className="text-[10px] text-sky-200/80">
                  {h.precipitationProbabilityPct}%
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-white/10">
          {days.map((d) => (
            <li
              key={d.date}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="w-20 shrink-0 text-sm font-medium text-white/80 sm:w-28">
                {formatIstDate(d.date)}
              </span>
              <span className="flex size-9 items-center justify-center">
                <MiniIcon condition={d.condition} isDay />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-white/55">
                {d.conditionLabel}
              </span>
              <span className="shrink-0 text-sm tabular-nums">
                <span className="font-semibold">{Math.round(d.maxTempC)}°</span>
                <span className="text-white/45"> / {Math.round(d.minTempC)}°</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
