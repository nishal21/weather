import type { CurrentWeather } from "@/lib/weather/types";
import { formatTempC } from "@/lib/format/units";
import { NavigationArrow } from "@phosphor-icons/react/dist/ssr";

type Props = {
  current: CurrentWeather;
  locationName: string;
  nearYou?: boolean;
};

export function CurrentHero({ current, locationName, nearYou }: Props) {
  return (
    <section className="text-white">
      {nearYou ? (
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-100">
          <NavigationArrow className="size-3.5" weight="fill" aria-hidden />
          Near you
        </p>
      ) : null}
      <p className="text-sm font-medium text-sky-100/90">Now in {locationName}</p>
      <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
        <p className="font-display text-7xl font-bold leading-none tracking-tighter sm:text-8xl">
          {Math.round(current.temperatureC)}
          <span className="text-4xl font-semibold sm:text-5xl">°</span>
        </p>
        <div className="pb-1.5">
          <p className="max-w-[14ch] text-2xl font-semibold leading-snug">
            {current.conditionLabel}
          </p>
          {current.feelsLikeC != null ? (
            <p className="mt-1 text-sm text-zinc-300">
              Feels like {formatTempC(current.feelsLikeC)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
