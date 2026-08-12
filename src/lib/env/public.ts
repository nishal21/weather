/**
 * Values safe to expose in the browser bundle.
 * Do not add API keys or secrets here.
 */
export const publicEnv = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
} as const;
