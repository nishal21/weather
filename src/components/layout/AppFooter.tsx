import { Phone } from "@phosphor-icons/react/dist/ssr";

type Props = {
  attribution: string;
};

export function AppFooter({ attribution }: Props) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950/85 px-4 py-6 text-sm text-zinc-300">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <p>{attribution}</p>
        <p className="text-zinc-400">
          Alerts are derived from the live forecast (rain, heat, storms, UV). Official IMD district
          colour bulletins can replace this layer when your API key is ready.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:1077"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 font-semibold text-white transition active:scale-[0.98] hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            <Phone className="size-4" weight="bold" aria-hidden />
            Call 1077
          </a>
          <a
            href="tel:1070"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 font-semibold text-white transition active:scale-[0.98] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            Call 1070
          </a>
        </div>
      </div>
    </footer>
  );
}
