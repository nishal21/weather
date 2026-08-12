import type { ReactNode } from "react";
import type { CurrentWeather } from "@/lib/weather/types";
import {
  formatMm,
  formatWind,
  windDirectionLabel,
} from "@/lib/format/units";
import {
  Drop,
  Wind,
  Gauge,
  CloudRain,
  Sun,
} from "@phosphor-icons/react/dist/ssr";

type Props = {
  current: CurrentWeather;
  uvIndexMax?: number;
};

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.09] px-3 py-3 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function MetricsRow({ current, uvIndexMax }: Props) {
  return (
    <section aria-label="Weather details" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <Metric
        icon={<Drop className="size-4" weight="bold" aria-hidden />}
        label="Humidity"
        value={`${current.humidityPct}%`}
      />
      <Metric
        icon={<Wind className="size-4" weight="bold" aria-hidden />}
        label="Wind"
        value={`${formatWind(current.windSpeedKmph)}${
          current.windDirectionDeg != null
            ? ` ${windDirectionLabel(current.windDirectionDeg)}`
            : ""
        }`}
      />
      <Metric
        icon={<CloudRain className="size-4" weight="bold" aria-hidden />}
        label="Rain"
        value={formatMm(current.rainfallLast24hMm)}
      />
      {current.pressureHpa != null ? (
        <Metric
          icon={<Gauge className="size-4" weight="bold" aria-hidden />}
          label="Pressure"
          value={`${current.pressureHpa} hPa`}
        />
      ) : null}
      {uvIndexMax != null ? (
        <Metric
          icon={<Sun className="size-4" weight="bold" aria-hidden />}
          label="UV max"
          value={String(uvIndexMax)}
        />
      ) : null}
    </section>
  );
}
