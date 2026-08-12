import "server-only";

/**
 * Server-only environment variables.
 * Never import this module from client components.
 * Never prefix secrets with NEXT_PUBLIC_.
 */
function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const serverEnv = {
  weatherDataSource: (readEnv("WEATHER_DATA_SOURCE") ?? "open-meteo").toLowerCase(),
  /** Optional paid BigDataCloud key — never sent to the browser. */
  bigDataCloudApiKey: readEnv("BIGDATACLOUD_API_KEY"),
  /** Optional MyMemory contact email for higher free quota — server only. */
  myMemoryContactEmail: readEnv("MYMEMORY_CONTACT_EMAIL"),
  /** Optional future IMD or other paid weather keys — server only. */
  imdApiKey: readEnv("IMD_API_KEY"),
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL")?.replace(/\/$/, ""),
} as const;

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
