/** Short plain-language labels for weather readouts. */

export function humidityDescription(pct: number): string {
  if (pct < 30) return "Dry air";
  if (pct < 50) return "Comfortable";
  if (pct < 70) return "A bit humid";
  if (pct < 85) return "Humid";
  return "Very humid";
}

export function windDescription(kmh: number): string {
  if (kmh < 5) return "Calm";
  if (kmh < 20) return "Light breeze";
  if (kmh < 40) return "Windy";
  if (kmh < 60) return "Strong wind";
  return "Very strong wind";
}

export function uvDescription(uv: number): string {
  if (uv < 3) return "Low risk";
  if (uv < 6) return "Moderate. Seek shade at midday";
  if (uv < 8) return "High. Protect your skin";
  if (uv < 11) return "Very high. Limit time in sun";
  return "Extreme. Stay in shade";
}

export function rainDescription(mm: number): string {
  if (mm <= 0) return "No rain lately";
  if (mm < 2.5) return "Light";
  if (mm < 15) return "Moderate";
  if (mm < 65) return "Heavy rain possible nearby";
  return "Very heavy rain";
}
