import { SITE, absoluteUrl } from "./site";

const SOCIAL_DESCRIPTION =
  "Live weather for India and cities worldwide. Hourly and 7-day outlook, rain, UV, and air quality.";

/** Versioned share image path — bump when replacing the file so CDNs drop stale bytes. */
export const OG_IMAGE_PATH = "/og-share.jpg";

export const OG_IMAGE = {
  url: absoluteUrl(OG_IMAGE_PATH),
  width: 1200,
  height: 630,
  alt: `${SITE.name}: live weather for India and worldwide cities`,
  type: "image/jpeg",
} as const;

/**
 * Tiny HTML document for LinkedIn/Facebook/Twitter/Discord crawlers.
 * Served from proxy so OG scans avoid a cold Next.js serverless render.
 */
export function seoBotHtml(): string {
  const title = `${SITE.name} | ${SITE.tagline}`;
  const url = absoluteUrl("/");
  const image = OG_IMAGE.url;
  const desc = SOCIAL_DESCRIPTION;
  const longDesc = SITE.description;

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="theme-color" content="${SITE.themeColor}"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(longDesc)}"/>
<link rel="canonical" href="${escapeHtml(url)}"/>
<meta name="robots" content="index, follow"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(desc)}"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:site_name" content="${escapeHtml(SITE.name)}"/>
<meta property="og:locale" content="${SITE.locale}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${escapeHtml(image)}"/>
<meta property="og:image:type" content="${OG_IMAGE.type}"/>
<meta property="og:image:width" content="${OG_IMAGE.width}"/>
<meta property="og:image:height" content="${OG_IMAGE.height}"/>
<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE.alt)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="${SITE.twitter}"/>
<meta name="twitter:creator" content="${SITE.twitter}"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(desc)}"/>
<meta name="twitter:image" content="${escapeHtml(image)}"/>
<link rel="icon" href="${escapeHtml(absoluteUrl(SITE.logo))}" type="${SITE.logoType}"/>
<link rel="apple-touch-icon" href="${escapeHtml(absoluteUrl(SITE.appleTouchIcon))}"/>
</head>
<body>
<main>
<h1>${escapeHtml(SITE.name)}</h1>
<p>${escapeHtml(longDesc)}</p>
<p><a href="${escapeHtml(url)}">Open live weather</a></p>
</main>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
