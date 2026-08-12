import type { HourlyForecast } from "@/lib/weather/types";
import { formatIstTime, formatTempC } from "@/lib/format/units";

type Props = {
  hours: HourlyForecast[];
};

export function HourlyStrip({ hours }: Props) {
  const slice = hours.slice(0, 24);
  if (!slice.length) return null;

  return (
    <section className="text-white">
      <h2 className="text-lg font-semibold">Next 24 hours</h2>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {slice.map((h) => (
          <li
            key={h.time}
            className="min-w-[4.5rem] shrink-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
          >
            <p className="text-xs text-zinc-300">{formatIstTime(h.time)}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {formatTempC(h.temperatureC)}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-zinc-300">
              {h.precipitationProbabilityPct != null
                ? `${h.precipitationProbabilityPct}% rain`
                : h.conditionLabel}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
