type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inject schema.org JSON-LD for SEO / GEO / AEO crawlers. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
