import { SITE } from "@/lib/seo/site";

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#070b12] px-4 py-8 text-center text-[11px] leading-relaxed text-white/42">
      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        <p>
          <a
            href={SITE.repository}
            className="font-medium text-white/62 underline decoration-white/20 underline-offset-2 transition hover:text-white/88"
            rel="me external noopener"
            target="_blank"
          >
            Source on GitHub
          </a>
          <span aria-hidden> · </span>
          <a
            href={SITE.licenseUrl}
            className="text-white/52 underline decoration-white/15 underline-offset-2 transition hover:text-white/72"
            rel="license external noopener"
            target="_blank"
          >
            {SITE.license}
          </a>
        </p>
        <p>
          Maintained by{" "}
          <a
            href={SITE.maintainerUrl}
            className="text-white/52 underline decoration-white/15 underline-offset-2 transition hover:text-white/72"
            rel="author external noopener"
            target="_blank"
          >
            {SITE.maintainer}
          </a>
          . Weather data from Open-Meteo (CC BY 4.0).
        </p>
        <p>
          Images and media may belong to their respective owners. Alerts are
          forecast-based tips, not official government warnings.
        </p>
      </div>
    </footer>
  );
}
