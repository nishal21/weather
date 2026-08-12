import type { WeatherCondition } from "@/lib/weather/types";
import type { IndiaSeason } from "@/lib/weather/season";

/** Outfit / plate band — mirrors AGSL average / over27 / below0 slots. */
export type TempBand = "average" | "over27" | "below0";

/** Page chrome under the hero — always dark so it never flashes sky-blue. Scene paints its own sky. */
export function sceneGradientForCondition(
  _condition: WeatherCondition,
  isDay = true,
): string {
  if (!isDay) return "from-[#070b12] via-[#0b1220] to-[#070b12]";
  return "from-[#0a121c] via-[#0b1410] to-[#070b12]";
}

/** Icon Lottie from /public/lottie/{white-mode|dark-mode} — day/night accurate. */
export function lottieSrcForCondition(
  condition: WeatherCondition,
  isDay = true,
  wmoCode?: number,
): string {
  const folder = isDay ? "white-mode" : "dark-mode";
  const file = (() => {
    switch (condition) {
      case "clear":
        // WMO 1 mainly clear → mostly_clear / mostly_sunny (Samsung)
        if (wmoCode === 1) {
          return isDay ? "mostly_sunny.json" : "mostly_clear.json";
        }
        return isDay ? "sunny.json" : "clear.json";
      case "heatwave":
        return "hot.json";
      case "partly_cloudy":
        return isDay ? "partly_cloud.json" : "partly_cloud_night.json";
      case "overcast":
        return isDay ? "cloudy.json" : "mostly_cloudy_night.json";
      case "haze":
      case "fog":
        return "fog.json";
      case "light_rain":
        // Night: no sun peeking through (avoid partly_sunny_*)
        return isDay ? "partly_sunny_with_shower.json" : "shower.json";
      case "heavy_rain":
        return isDay ? "rain_and_thunder.json" : "heavy_rain.json";
      case "thunderstorm":
        return isDay
          ? "partly_sunny_with_thunder.json"
          : "thunderstorm.json";
      case "snow":
        return isDay ? "hail.json" : "snow.json";
      case "windy":
        return isDay ? "wind.json" : "wind.json";
      default:
        return isDay ? "mostly_sunny.json" : "clear.json";
    }
  })();

  return `/lottie/${folder}/${file}`;
}

/** Full-sky Samsung One UI cloud Lottie (APK dark/white packs) — not the hero icon. */
export function skyCloudLottieSrc(
  condition: WeatherCondition,
  isDay = true,
): string {
  const darkSky =
    !isDay ||
    condition === "light_rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm" ||
    condition === "overcast" ||
    condition === "fog" ||
    condition === "haze" ||
    condition === "snow";
  const folder = darkSky ? "dark-mode" : "white-mode";
  const file = (() => {
    switch (condition) {
      case "partly_cloudy":
        return isDay ? "partly_cloud.json" : "partly_cloud_night.json";
      case "overcast":
      case "light_rain":
      case "heavy_rain":
      case "thunderstorm":
        return isDay ? "cloudy.json" : "mostly_cloudy_night.json";
      case "fog":
      case "haze":
        return "mostly_cloudy.json";
      case "snow":
        return "mostly_cloudy_night.json";
      case "windy":
        return isDay ? "partly_cloud.json" : "partly_cloud_night.json";
      default:
        return isDay ? "mostly_cloudy.json" : "mostly_cloudy_night.json";
    }
  })();
  return `/lottie/${folder}/${file}`;
}

/** Photoreal FAR/NEAR plates from APK res/*.webp — season modulates look. */
export function groundSrcForCondition(
  condition: WeatherCondition,
  isDay = true,
  layer: "far" | "near" = "near",
  season: IndiaSeason = "summer",
): string {
  const base = "/scenes/apk";
  if (!isDay) {
    return layer === "far"
      ? `${base}/ground-far-cool.webp`
      : `${base}/ground-night.webp`;
  }
  if (condition === "snow" || (season === "winter" && condition === "fog")) {
    return layer === "far"
      ? `${base}/ground-ice.webp`
      : `${base}/ground-snow.webp`;
  }
  if (condition === "heatwave" || (season === "summer" && condition === "clear")) {
    return `${base}/ground-heat.webp`;
  }
  switch (condition) {
    case "light_rain":
    case "heavy_rain":
    case "thunderstorm":
      return layer === "far"
        ? `${base}/ground-far-cool.webp`
        : `${base}/ground-rain.webp`;
    case "fog":
    case "haze":
    case "overcast":
      if (season === "monsoon") {
        return layer === "far"
          ? `${base}/ground-far-cool.webp`
          : `${base}/ground-rain.webp`;
      }
      return layer === "far"
        ? `${base}/ground-mist.webp`
        : `${base}/ground-dark.webp`;
    case "clear":
    case "partly_cloudy":
    case "windy":
    default:
      if (season === "monsoon") {
        return layer === "far"
          ? `${base}/ground-far-cool.webp`
          : `${base}/ground-meadow.webp`;
      }
      if (season === "winter") {
        return layer === "far"
          ? `${base}/ground-far-cool.webp`
          : `${base}/ground-dark.webp`;
      }
      if (season === "post_monsoon") {
        return layer === "far"
          ? `${base}/ground-far-green.webp`
          : `${base}/ground-lush.webp`;
      }
      return layer === "far"
        ? `${base}/ground-far-green.webp`
        : `${base}/ground-lush.webp`;
  }
}

export const APK_HUMAN_SRC = "/scenes/apk/human.webp";
export const APK_HUMAN_WEBM = "/scenes/apk/human.webm";

export function scenePalette(condition: WeatherCondition, isDay = true) {
  if (!isDay) {
    return {
      skyTop: "#0b1220",
      skyMid: "#1a2744",
      skyBot: "#243652",
      hillTop: "#1e3a2f",
      hillBot: "#0f1f18",
      farHill: "#1a2e28",
      waterTop: "#1e3a5f",
      waterBot: "#0f172a",
      grassStroke: "#2d5a45",
    };
  }
  switch (condition) {
    case "clear":
    case "heatwave":
      return {
        skyTop: "#2a6f9e",
        skyMid: "#3d7a8f",
        skyBot: "#0f1a14",
        hillTop: "#4ade80",
        hillBot: "#15803d",
        farHill: "#22c55e",
        waterTop: "#2a6f9e",
        waterBot: "#0f172a",
        grassStroke: "#166534",
      };
    case "partly_cloudy":
    case "windy":
      return {
        skyTop: "#3a6d88",
        skyMid: "#4a7080",
        skyBot: "#0f1a14",
        hillTop: "#3f9b5e",
        hillBot: "#1a5c38",
        farHill: "#4aab6a",
        waterTop: "#3a6d88",
        waterBot: "#0f172a",
        grassStroke: "#1e5c3a",
      };
    case "overcast":
    case "haze":
      return {
        skyTop: "#8a9aab",
        skyMid: "#6b7c8d",
        skyBot: "#4a5b6a",
        hillTop: "#4d7c5a",
        hillBot: "#243f30",
        farHill: "#3f6b4f",
        waterTop: "#5a7084",
        waterBot: "#2a3848",
        grassStroke: "#365f42",
      };
    case "fog":
      return {
        skyTop: "#c5ced6",
        skyMid: "#a8b4be",
        skyBot: "#7f8e9a",
        hillTop: "#6a8570",
        hillBot: "#3d5346",
        farHill: "#7a9080",
        waterTop: "#8a9aaa",
        waterBot: "#4a5868",
        grassStroke: "#4a6554",
      };
    case "light_rain":
    case "heavy_rain":
    case "thunderstorm":
      return {
        skyTop: "#334155",
        skyMid: "#1e293b",
        skyBot: "#0f172a",
        hillTop: "#365f42",
        hillBot: "#0f1f18",
        farHill: "#1e3a2f",
        waterTop: "#1e3a5f",
        waterBot: "#020617",
        grassStroke: "#14532d",
      };
    case "snow":
      return {
        skyTop: "#e2e8f0",
        skyMid: "#cbd5e1",
        skyBot: "#94a3b8",
        hillTop: "#b8c9c0",
        hillBot: "#5a6e68",
        farHill: "#d0dce0",
        waterTop: "#94a3b8",
        waterBot: "#475569",
        grassStroke: "#64748b",
      };
    default:
      return {
        skyTop: "#64748b",
        skyMid: "#475569",
        skyBot: "#334155",
        hillTop: "#4d7c5a",
        hillBot: "#1e3a2f",
        farHill: "#3f6b4f",
        waterTop: "#64748b",
        waterBot: "#334155",
        grassStroke: "#365f42",
      };
  }
}
