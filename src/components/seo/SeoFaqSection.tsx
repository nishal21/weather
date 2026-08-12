import { SITE_FAQ } from "@/lib/seo/faq";

/** Visible FAQ for answer engines. Uses definition list semantics. */
export function SeoFaqSection() {
  return (
    <section className="seo-faq" aria-labelledby="seo-faq-heading">
      <h2 id="seo-faq-heading">Common questions</h2>
      <dl className="seo-faq-list">
        {SITE_FAQ.map((item) => (
          <div key={item.question} className="seo-faq-item">
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
