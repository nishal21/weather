import type { AlertActionTip } from "@/lib/weather/types";
import { Phone, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

type Props = {
  tips: AlertActionTip[];
};

export function ActionTips({ tips }: Props) {
  const top = tips.filter((t) => t.priority === 1).slice(0, 3);
  const more = tips.filter((t) => t.priority !== 1);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="size-5 text-sky-300" weight="fill" aria-hidden />
        What to do now
      </h2>
      <ul className="mt-3 space-y-2">
        {top.map((tip) => (
          <li key={tip.id}>
            {tip.phoneHref ? (
              <a
                href={tip.phoneHref}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 font-medium text-white transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              >
                <Phone className="size-4 shrink-0" weight="bold" aria-hidden />
                {tip.text}
              </a>
            ) : (
              <p className="rounded-xl bg-white/5 px-3 py-2 text-[15px] leading-snug">{tip.text}</p>
            )}
          </li>
        ))}
      </ul>
      {more.length > 0 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-sky-200 underline-offset-2 hover:underline">
            More guidance
          </summary>
          <ul className="mt-2 space-y-2 text-[15px] text-zinc-100">
            {more.map((tip) => (
              <li key={tip.id} className="rounded-xl bg-white/5 px-3 py-2">
                {tip.text}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
