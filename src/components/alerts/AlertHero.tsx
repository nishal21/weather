import type { WeatherAlert } from "@/lib/weather/types";
import { SEVERITY_LABEL, SEVERITY_SHORT, severityClasses } from "@/lib/weather/alert-styles";
import { Warning, Info, CheckCircle } from "@phosphor-icons/react/dist/ssr";

type Props = {
  alerts: WeatherAlert[];
  locationName: string;
};

export function AlertHero({ alerts, locationName }: Props) {
  if (!alerts.length) {
    return (
      <section
        className="rounded-2xl border border-emerald-500/40 bg-emerald-600/90 px-4 py-4 text-white shadow-lg"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 size-7 shrink-0" weight="fill" aria-hidden />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-50">
              All clear signals
            </p>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              No severe weather flags for {locationName}
            </h2>
            <p className="mt-1 text-base text-emerald-50/95">
              Based on the live forecast. Conditions can change - check again before travel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const top = alerts[0];
  const Icon = top.severity === "red" || top.severity === "orange" ? Warning : Info;

  return (
    <section
      className={`rounded-2xl border px-4 py-4 shadow-lg ${severityClasses(top.severity)}`}
      aria-live={top.severity === "red" ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-7 shrink-0" weight="fill" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
            {SEVERITY_SHORT[top.severity]} · live forecast
          </p>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{top.title}</h2>
          <p className="mt-1 text-base font-medium opacity-95">{top.summary}</p>
        </div>
      </div>
      {alerts.length > 1 ? (
        <ul className="mt-4 space-y-2 border-t border-black/10 pt-3">
          {alerts.slice(1).map((a) => (
            <li key={a.id} className="text-sm leading-snug">
              <span className="font-semibold">
                {SEVERITY_SHORT[a.severity]} ({SEVERITY_LABEL[a.severity]}):
              </span>{" "}
              {a.title}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
