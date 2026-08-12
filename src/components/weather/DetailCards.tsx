import type { CurrentWeather, AstronomyDay } from "@/lib/weather/types";
import {
  formatMm,
  formatWind,
  formatIstTime,
  windDirectionLabel,
} from "@/lib/format/units";
import {
  humidityDescription,
  windDescription,
  uvDescription,
  rainDescription,
} from "@/lib/format/weather-copy";
import {
  Drop,
  Wind,
  Sun,
  CloudRain,
  Gauge,
  Thermometer,
  SunHorizon,
  MoonStars,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

function Card({
  icon,
  title,
  value,
  hint,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-[1.25rem] bg-white/12 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      <div className="flex items-center gap-2 text-[13px] font-medium text-white/75">
        {icon}
        {title}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-sm leading-snug text-white/65">{hint}</p>
    </article>
  );
}

type Props = {
  current: CurrentWeather;
  uvIndexMax?: number;
  astronomy?: AstronomyDay;
};

export function DetailCards({ current, uvIndexMax, astronomy }: Props) {
  return (
    <section
      aria-label="Weather details"
      className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        icon={<Thermometer className="size-4" weight="bold" aria-hidden />}
        title="Feels like"
        value={
          current.feelsLikeC != null
            ? `${Math.round(current.feelsLikeC)}°`
            : `${Math.round(current.temperatureC)}°`
        }
        hint="How warm it feels on your skin"
      />
      <Card
        icon={<Drop className="size-4" weight="bold" aria-hidden />}
        title="Humidity"
        value={`${current.humidityPct}%`}
        hint={humidityDescription(current.humidityPct)}
      />
      <Card
        icon={<Wind className="size-4" weight="bold" aria-hidden />}
        title="Wind"
        value={`${formatWind(current.windSpeedKmph)}${
          current.windDirectionDeg != null
            ? ` ${windDirectionLabel(current.windDirectionDeg)}`
            : ""
        }`}
        hint={windDescription(current.windSpeedKmph)}
      />
      <Card
        icon={<CloudRain className="size-4" weight="bold" aria-hidden />}
        title="Precipitation"
        value={formatMm(current.rainfallLast24hMm)}
        hint={rainDescription(current.rainfallLast24hMm)}
      />
      {uvIndexMax != null ? (
        <Card
          icon={<Sun className="size-4" weight="bold" aria-hidden />}
          title="UV index"
          value={String(uvIndexMax)}
          hint={uvDescription(uvIndexMax)}
        />
      ) : null}
      {current.pressureHpa != null ? (
        <Card
          icon={<Gauge className="size-4" weight="bold" aria-hidden />}
          title="Pressure"
          value={`${current.pressureHpa} hPa`}
          hint="Air pressure at your location"
        />
      ) : null}
      {astronomy ? (
        <Card
          icon={<SunHorizon className="size-4" weight="bold" aria-hidden />}
          title="Sunrise"
          value={formatIstTime(astronomy.sunrise)}
          hint="Local sunrise time"
        />
      ) : null}
      {astronomy ? (
        <Card
          icon={<MoonStars className="size-4" weight="bold" aria-hidden />}
          title="Sunset"
          value={formatIstTime(astronomy.sunset)}
          hint="Local sunset time"
        />
      ) : null}
    </section>
  );
}
