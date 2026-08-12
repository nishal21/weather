"use client";

import type { CurrentWeather, AstronomyDay } from "@/lib/weather/types";
import {
  formatLocalTime,
  formatWindSpeed,
  windDirectionKey,
} from "@/lib/format/localized-units";
import { GlassCard } from "@/components/weather/GlassCard";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

type Props = {
  current: CurrentWeather;
  astronomy?: AstronomyDay;
};

function Tile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <GlassCard as="article" className="card-rise !p-3.5 sm:!p-4">
      <p className="truncate text-[12px] font-medium text-white/50">{label}</p>
      <p className="mt-2.5 font-display text-[1.65rem] font-semibold leading-none tabular-nums tracking-tight text-white">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 line-clamp-3 break-words text-[11px] leading-snug text-white/45">
          {hint}
        </p>
      ) : null}
    </GlassCard>
  );
}

export function DetailTiles({ current, astronomy }: Props) {
  const { locale } = useLocale();
  const t = useT();
  const humidityHint =
    current.humidityPct < 30
      ? t("tile.hint.humidity.dry")
      : current.humidityPct < 50
        ? t("tile.hint.humidity.comfortable")
        : current.humidityPct < 70
          ? t("tile.hint.humidity.bitHumid")
          : current.humidityPct < 85
            ? t("tile.hint.humidity.humid")
            : t("tile.hint.humidity.veryHumid");
  const windHint =
    current.windSpeedKmph < 5
      ? t("tile.hint.wind.calm")
      : current.windSpeedKmph < 20
        ? t("tile.hint.wind.light")
        : current.windSpeedKmph < 40
          ? t("tile.hint.wind.windy")
          : current.windSpeedKmph < 60
            ? t("tile.hint.wind.strong")
            : t("tile.hint.wind.veryStrong");

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <Tile
        label={t("hero.feelsLike")}
        value={`${Math.round(current.feelsLikeC ?? current.temperatureC)}°`}
        hint={t("tile.hint.feelsLike")}
      />
      <Tile
        label={t("tile.humidity")}
        value={`${current.humidityPct}%`}
        hint={humidityHint}
      />
      <Tile
        label={t("tile.wind")}
        value={`${Math.round(current.windSpeedKmph)}`}
        hint={`${
          current.windDirectionDeg != null
            ? `${t(windDirectionKey(current.windDirectionDeg))} · `
            : ""
        }${formatWindSpeed(current.windSpeedKmph, locale)} · ${windHint}`}
      />
      {current.dewPointC != null ? (
        <Tile
          label={t("tile.dewPoint")}
          value={`${current.dewPointC}°`}
          hint={
            current.dewPointC >= 24
              ? t("tile.hint.sticky")
              : current.dewPointC >= 16
                ? t("tile.hint.muggy")
                : t("tile.hint.comfortable")
          }
        />
      ) : current.pressureHpa != null ? (
        <Tile
          label={t("tile.pressure")}
          value={`${current.pressureHpa}`}
          hint={t("tile.hint.seaLevel")}
        />
      ) : null}

      {current.visibilityKm != null ? (
        <Tile
          label={t("tile.visibility")}
          value={`${current.visibilityKm} km`}
          hint={
            current.visibilityKm >= 10
              ? t("tile.hint.visibility.good")
              : current.visibilityKm >= 4
                ? t("tile.hint.visibility.haze")
                : t("tile.hint.visibility.poor")
          }
        />
      ) : null}

      {current.pressureHpa != null && current.dewPointC != null ? (
        <Tile
          label={t("tile.pressure")}
          value={`${current.pressureHpa}`}
          hint={t("tile.hint.seaLevel")}
        />
      ) : null}

      {astronomy ? (
        <>
          <Tile
            label={t("tile.sunrise")}
            value={formatLocalTime(astronomy.sunrise, locale)}
            hint={t("tile.hint.dawn")}
          />
          <Tile
            label={t("tile.sunset")}
            value={formatLocalTime(astronomy.sunset, locale)}
            hint={t("tile.hint.dusk")}
          />
        </>
      ) : null}
    </div>
  );
}
