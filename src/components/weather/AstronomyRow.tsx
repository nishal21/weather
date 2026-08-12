import type { AstronomyDay } from "@/lib/weather/types";
import { formatIstTime } from "@/lib/format/units";
import { SunHorizon, Moon } from "@phosphor-icons/react/dist/ssr";

type Props = {
  astronomy: AstronomyDay;
};

export function AstronomyRow({ astronomy }: Props) {
  return (
    <section
      aria-label="Sun times"
      className="grid grid-cols-2 gap-2 text-white"
    >
      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
        <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <SunHorizon className="size-4" weight="bold" aria-hidden />
          Sunrise
        </p>
        <p className="mt-1 text-lg font-semibold">{formatIstTime(astronomy.sunrise)}</p>
      </div>
      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
        <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Moon className="size-4" weight="bold" aria-hidden />
          Sunset
        </p>
        <p className="mt-1 text-lg font-semibold">{formatIstTime(astronomy.sunset)}</p>
      </div>
    </section>
  );
}
