import { SITE_FAQ } from "@/lib/seo/faq";

/** Crawlable FAQ block for answer engines (visible, compact, non-intrusive). */
export function SeoFaqSection() {
  return (
    <section
      aria-labelledby="seo-faq-heading"
      className="mx-auto mt-10 max-w-xl px-4 pb-8 text-left"
    >
      <h2
        id="seo-faq-heading"
        className="text-[13px] font-semibold uppercase tracking-wide text-white/35"
      >
        Common questions
      </h2>
      <dl className="mt-3 space-y-3">
        {SITE_FAQ.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
          >
            <dt className="text-[14px] font-medium text-white/75">
              {item.question}
            </dt>
            <dd className="mt-1.5 text-[13px] leading-relaxed text-white/45">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
