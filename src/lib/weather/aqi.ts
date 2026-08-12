import type { AirQualityIndex } from "./types";

/** European AQI bands (Open-Meteo european_aqi). */
export function categorizeEuropeanAqi(value: number): AirQualityIndex {
  const v = Math.round(value);
  let category: string;
  if (v <= 20) category = "Good";
  else if (v <= 40) category = "Fair";
  else if (v <= 60) category = "Moderate";
  else if (v <= 80) category = "Poor";
  else if (v <= 100) category = "Very poor";
  else category = "Extremely poor";
  return { value: v, category };
}
