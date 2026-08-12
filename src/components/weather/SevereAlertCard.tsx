"use client";

import type {
  AlertActionTip,
  AlertSeverity,
  WeatherAlert,
} from "@/lib/weather/types";
import { Warning, Phone } from "@phosphor-icons/react";
import { useT } from "@/components/i18n/LocaleProvider";

type Props = {
  alerts: WeatherAlert[];
  tips?: AlertActionTip[];
};

function severityAccent(severity: AlertSeverity, t: ReturnType<typeof useT>) {
  switch (severity) {
    case "red":
      return {
        border: "border-l-red-400/55",
        dot: "bg-red-400",
        label: t("alerts.takeAction"),
      };
    case "orange":
      return {
        border: "border-l-orange-400/50",
        dot: "bg-orange-400",
        label: t("alerts.bePrepared"),
      };
    case "yellow":
      return {
        border: "border-l-amber-400/45",
        dot: "bg-amber-400",
        label: t("alerts.stayUpdated"),
      };
    default:
      return {
        border: "border-l-white/20",
        dot: "bg-white/40",
        label: "Advisory",
      };
  }
}

/** Calm, glass-style alert board — clear severity without alarmist chrome. */
export function SevereAlertCard({ alerts, tips = [] }: Props) {
  const t = useT();
  const severe = alerts.filter(
    (a) =>
      a.severity === "yellow" ||
      a.severity === "orange" ||
      a.severity === "red",
  );
  if (severe.length === 0) return null;

  const ranked = [...severe].sort((a, b) => {
    const rank = { red: 0, orange: 1, yellow: 2, green: 3, white: 4 } as const;
    return rank[a.severity] - rank[b.severity];
  });
  const top = ranked[0];
  const accent = severityAccent(top.severity, t);
  const actionTips = tips
    .filter((tip) => tip.priority <= 2)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  return (
    <section
      aria-label={t("alerts.title")}
      className={`weather-panel card-rise border-l-[3px] ${accent.border}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70">
          <Warning className="size-4" weight="fill" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold tracking-tight text-white">
            {t("alerts.title")}
          </h2>
          <p className="mt-0.5 text-[13px] text-white/50">
            {ranked.length} {t("alerts.active")} · {accent.label}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium capitalize text-white/70">
          <span className={`size-1.5 rounded-full ${accent.dot}`} aria-hidden />
          {top.severity}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-white/[0.06]">
        {ranked.map((a) => (
          <li key={a.id} className="py-3 first:pt-0 last:pb-0">
            <p className="text-[15px] font-medium leading-snug text-white">
              {a.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/55">
              {a.summary}
            </p>
          </li>
        ))}
      </ul>

      {actionTips.length > 0 ? (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <p className="weather-panel-label mb-2.5">{t("alerts.whatToDo")}</p>
          <ul className="space-y-2">
            {actionTips.map((tip) => (
              <li key={tip.id}>
                {tip.phoneHref ? (
                  <a
                    href={tip.phoneHref}
                    className="group inline-flex min-h-10 w-full items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] leading-snug text-white/75 transition hover:border-white/15 hover:bg-white/[0.06]"
                  >
                    <Phone
                      className="mt-0.5 size-4 shrink-0 text-white/45 group-hover:text-sky-300/80"
                      weight="bold"
                      aria-hidden
                    />
                    <span>{tip.text}</span>
                  </a>
                ) : (
                  <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[13px] leading-snug text-white/65">
                    {tip.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-3 text-[11px] text-white/35">
        {t("alerts.footer")}
      </p>
    </section>
  );
}
