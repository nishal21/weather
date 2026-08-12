import type { WeatherCondition } from "./types";
import type { IndiaSeason } from "./season";
import { indiaSeasonFromDate } from "./season";

const VIDEO_BASE = "/videos";

/** All condition atmosphere clips under public/videos/. */
export const WEATHER_VIDEO_FILES = {
  clearDay: "3D_sun_rotating_in_sky_202608072155.mp4",
  clearNight: "Crescent_moon_in_night_sky_202608072155.mp4",
  partlyCloudy: "Clouds_drifting_across_blue_sky_202608072155.mp4",
  overcast: "Clouds_rolling_in_sky_202608072155.mp4",
  fog: "Mist_rolling_across_weather_screen_202608072155.mp4",
  lightRain: "Rain_falling_on_water_202608072155.mp4",
  heavyRain: "Lightning_flashing_in_heavy_rain_202608072155.mp4",
  windy: "Leaves_blowing_across_teal_sky_202608072155.mp4",
  snow: "Snowflakes_drifting_down_blue_ba._202608072155.mp4",
  fallback: "Weather_app_background_animation_202608072155.mp4",
} as const;

export type WeatherVideoKey = keyof typeof WEATHER_VIDEO_FILES;

/**
 * Pick sky video from weather + Indian season.
 * Every file in WEATHER_VIDEO_FILES is reachable for some condition×season.
 */
export function videoKeyForCondition(
  condition: WeatherCondition,
  isDay = true,
  season: IndiaSeason = indiaSeasonFromDate(),
): WeatherVideoKey {
  // Night first — clear night sky clip
  if (!isDay && (condition === "clear" || condition === "partly_cloudy")) {
    return "clearNight";
  }
  if (!isDay && condition === "fog") return "fog";

  switch (condition) {
    case "heatwave":
      return "clearDay";

    case "clear":
      if (!isDay) return "clearNight";
      return "clearDay";

    case "partly_cloudy":
      if (!isDay) return "clearNight";
      return "partlyCloudy";

    case "overcast":
      return "overcast";

    case "haze":
      if (season === "winter" || season === "post_monsoon") return "fog";
      return "overcast";

    case "fog":
      return "fog";

    case "light_rain":
      return "lightRain";

    case "heavy_rain":
    case "thunderstorm":
      return "heavyRain";

    case "windy":
      return "windy";

    case "snow":
      return "snow";

    default:
      return "fallback";
  }
}

export function videoSrcForCondition(
  condition: WeatherCondition,
  isDay = true,
  season?: IndiaSeason,
): string {
  const key = videoKeyForCondition(
    condition,
    isDay,
    season ?? indiaSeasonFromDate(),
  );
  return `${VIDEO_BASE}/${WEATHER_VIDEO_FILES[key]}`;
}

export function fallbackVideoSrc(): string {
  return `${VIDEO_BASE}/${WEATHER_VIDEO_FILES.fallback}`;
}

/** For tests / docs: which seasons can surface each clip. */
export function videoCoverageNote(): Record<WeatherVideoKey, string> {
  return {
    clearDay: "clear/heatwave day · summer & post-monsoon",
    clearNight: "clear/partly night",
    partlyCloudy: "partly day · winter/monsoon clear softening",
    overcast: "overcast · monsoon partly · windy monsoon",
    fog: "fog · winter haze/drizzle · winter overcast",
    lightRain: "light_rain · monsoon overcast",
    heavyRain: "heavy_rain / thunderstorm",
    windy: "windy (summer / default)",
    snow: "snow",
    fallback: "unknown / post-monsoon default",
  };
}
