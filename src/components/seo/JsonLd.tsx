type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function jsonLdText(data: Props["data"]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Inject schema.org JSON-LD. Angle brackets are escaped so HTML cannot break out. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdText(data) }}
    />
  );
}
