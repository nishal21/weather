"use client";

import { useState } from "react";
import type { DailyForecast, HourlyForecast, WeatherCondition } from "@/lib/weather/types";
import { formatIstDate, formatIstTime, formatTempC } from "@/lib/format/units";
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
  CalendarBlank,
  Clock,
} from "@phosphor-icons/react";

function MiniIcon({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const cls = "size-7";
  switch (condition) {
    case "clear":
      return isDay ? (
        <Sun className={`${cls} text-amber-200`} weight="fill" />
      ) : (
        <Moon className={`${cls} text-slate-100`} weight="fill" />
      );
    case "partly_cloudy":
      return isDay ? (
        <CloudSun className={`${cls} text-sky-100`} weight="fill" />
      ) : (
        <CloudMoon className={`${cls} text-sky-100`} weight="fill" />
      );
    case "fog":
    case "haze":
    case "overcast":
      return <CloudFog className={`${cls} text-slate-200`} weight="fill" />;
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
      return <CloudSun className={`${cls} text-sky-100`} weight="fill" />;
  }
}

type Props = {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isDay?: boolean;
};

export function ForecastSheet({ hourly, daily, isDay = true }: Props) {
  const [mode, setMode] = useState<"day" | "week">("day");
  const hours = hourly.slice(0, 12);
  const days = daily.slice(0, 7);

  return (
    <section className="relative z-10 -mt-2 text-white">
      {/* Wavy top edge */}
      <svg
        className="relative z-10 block w-full text-[#121826]"
        viewBox="0 0 390 36"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 24 C 65 4, 110 34, 170 18 C 230 2, 280 28, 330 14 C 360 6, 380 10, 390 12 L390 36 L0 36 Z"
        />
      </svg>

      <div className="rounded-b-[2rem] bg-[#121826] px-5 pb-28 pt-1 sm:rounded-b-3xl">
        <div className="mb-4 flex items-center gap-2">
          {mode === "day" ? (
            <Clock className="size-5 text-sky-300" weight="bold" aria-hidden />
          ) : (
            <CalendarBlank className="size-5 text-sky-300" weight="bold" aria-hidden />
          )}
          <h2 className="text-lg font-semibold tracking-tight">Forecast</h2>
        </div>

        <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mode === "day"
            ? hours.map((h) => (
                <li
                  key={h.time}
                  className="flex w-[4.6rem] shrink-0 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-slate-400">
                    {formatIstTime(h.time)}
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#1a2233] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.35)]">
                    <MiniIcon condition={h.condition} isDay={isDay} />
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round(h.temperatureC)}°
                  </span>
                </li>
              ))
            : days.map((d) => (
                <li
                  key={d.date}
                  className="flex w-[4.6rem] shrink-0 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-slate-400">
                    {formatIstDate(d.date).split(",")[0] || formatIstDate(d.date)}
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#1a2233] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.35)]">
                    <MiniIcon condition={d.condition} isDay />
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round(d.maxTempC)}°
                  </span>
                  <span className="sr-only">
                    {d.conditionLabel}, low {formatTempC(d.minTempC)}
                  </span>
                </li>
              ))}
        </ul>

        {/* Day / Week toggle */}
        <div className="mx-auto mt-6 flex w-fit items-center rounded-full bg-[#0c111c] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => setMode("day")}
            className={`relative min-h-10 rounded-full px-6 text-sm font-semibold transition ${
              mode === "day"
                ? "bg-[#1e293b] text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                : "text-slate-400"
            }`}
            aria-pressed={mode === "day"}
          >
            {mode === "day" ? (
              <span className="absolute top-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sky-400" />
            ) : null}
            DAY
          </button>
          <button
            type="button"
            onClick={() => setMode("week")}
            className={`relative min-h-10 rounded-full px-6 text-sm font-semibold transition ${
              mode === "week"
                ? "bg-[#1e293b] text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                : "text-slate-400"
            }`}
            aria-pressed={mode === "week"}
          >
            {mode === "week" ? (
              <span className="absolute top-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sky-400" />
            ) : null}
            WEEK
          </button>
        </div>
      </div>
    </section>
  );
}
