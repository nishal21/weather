import type { WeatherCondition } from "./types";

const HEATWAVE_C = 40;

/**
 * Map WMO weather codes to app conditions.
 * WMO 0 clear, 1 mainly clear map to clear scene (not cloudy).
 * WMO 2 maps to partly cloudy.
 */
export function mapWmoCodeToCondition(
  code: number,
  opts?: { temperatureC?: number; windSpeedKmph?: number },
): WeatherCondition {
  if (
    opts?.temperatureC != null &&
    opts.temperatureC >= HEATWAVE_C &&
    (code === 0 || code === 1 || code === 2)
  ) {
    return "heatwave";
  }

  if (
    opts?.windSpeedKmph != null &&
    opts.windSpeedKmph >= 40 &&
    code <= 3
  ) {
    return "windy";
  }

  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly_cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57, 61, 80].includes(code)) return "light_rain";
  if ([63, 65, 81, 82].includes(code)) return "heavy_rain";
  if (code >= 95 && code <= 99) return "thunderstorm";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([66, 67].includes(code)) return "light_rain";
  return "overcast";
}

export function wmoConditionLabel(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] ?? "Weather update";
}

/** Parse Open-Meteo local timestamps (no offset) as wall-clock minutes from midnight. */
export function wallClockMinutes(iso: string): number | null {
  const m = iso.match(/(\d{2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/**
 * Prefer sunrise/sunset over API is_day so night cities never show daytime sun icons.
 */
export function resolveIsDay(opts: {
  observedAt: string;
  apiIsDay?: boolean;
  sunrise?: string;
  sunset?: string;
}): boolean {
  const now = wallClockMinutes(opts.observedAt);
  const rise = opts.sunrise ? wallClockMinutes(opts.sunrise) : null;
  const set = opts.sunset ? wallClockMinutes(opts.sunset) : null;
  if (now != null && rise != null && set != null) {
    if (rise <= set) return now >= rise && now < set;
    // polar / wrap edge-case
    return now >= rise || now < set;
  }
  return opts.apiIsDay ?? true;
}
