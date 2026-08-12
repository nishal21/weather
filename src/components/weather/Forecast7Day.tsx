import type { DailyForecast } from "@/lib/weather/types";
import { formatIstDate, formatTempC } from "@/lib/format/units";

type Props = {
  days: DailyForecast[];
};

export function Forecast7Day({ days }: Props) {
  if (!days.length) return null;

  return (
    <section className="text-white">
      <h2 className="text-lg font-semibold">7-day forecast</h2>
      <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
        {days.map((d) => (
          <li
            key={d.date}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium">{formatIstDate(d.date)}</p>
              <p className="truncate text-sm text-zinc-300">{d.conditionLabel}</p>
            </div>
            <div className="shrink-0 text-right tabular-nums">
              <p className="font-semibold">
                {formatTempC(d.maxTempC)}{" "}
                <span className="text-zinc-400">{formatTempC(d.minTempC)}</span>
              </p>
              {d.rainChancePct != null ? (
                <p className="text-xs text-sky-200">{d.rainChancePct}% rain</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
