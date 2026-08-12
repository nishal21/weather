/** Indian meteorological seasons (IMD-style). */
export type IndiaSeason =
  | "winter"
  | "summer"
  | "monsoon"
  | "post_monsoon";

/** Resolve season from a local calendar date (month 1–12). */
export function indiaSeasonFromMonth(month: number): IndiaSeason {
  if (month === 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "summer";
  if (month >= 6 && month <= 9) return "monsoon";
  return "post_monsoon";
}

/** Parse Open-Meteo / ISO date-ish strings → season. */
export function indiaSeasonFromDate(iso: string | Date = new Date()): IndiaSeason {
  if (iso instanceof Date) {
    return indiaSeasonFromMonth(iso.getMonth() + 1);
  }
  const m = iso.match(/^(\d{4})-(\d{2})/);
  if (m) return indiaSeasonFromMonth(Number(m[2]));
  const d = new Date(iso);
  if (!Number.isNaN(d.getTime())) return indiaSeasonFromMonth(d.getMonth() + 1);
  return indiaSeasonFromMonth(new Date().getMonth() + 1);
}

export function seasonLabel(season: IndiaSeason): string {
  switch (season) {
    case "winter":
      return "Winter";
    case "summer":
      return "Summer";
    case "monsoon":
      return "Monsoon";
    case "post_monsoon":
      return "Post-monsoon";
  }
}
