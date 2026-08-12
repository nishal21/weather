import type { WeatherCondition } from "@/lib/weather/types";

/** Uniforms from APK CLOUD_CANVAS class_*.json → AGSL code_3. */
export type CloudUniforms = {
  hidden?: boolean;
  initShiftX: number;
  initShiftY: number;
  cloudDensity: number;
  cloudSpeed: number;
  cloudScale: number;
  cloudDark: number;
  cloudLight: number;
  cloudCover: number;
  cloudAlpha: number;
  skyTint: number;
  cloudType: number;
  fdmCount: number;
  rNoiseCount: number;
  cNoiseCount: number;
  uBottomFade: number;
  uTopFade: number;
  skyColor1: [number, number, number];
  skyColor2: [number, number, number];
  skyColorGradientPos: number;
};

/** Rain night — based on class_99 (21_NIGHT CLOUD_CANVAS). */
const RAIN_NIGHT: CloudUniforms = {
  initShiftX: 0.3,
  initShiftY: 0,
  cloudDensity: 0.55,
  cloudSpeed: 0.004,
  cloudScale: 0.9,
  cloudDark: 0.12,
  cloudLight: 0.45,
  cloudCover: 0.55,
  cloudAlpha: 0.08,
  skyTint: 1,
  cloudType: 0,
  fdmCount: 5,
  rNoiseCount: 6,
  cNoiseCount: 5,
  uBottomFade: 0.72,
  uTopFade: 0.02,
  skyColor1: [0.12, 0.18, 0.28],
  skyColor2: [0.35, 0.42, 0.5],
  skyColorGradientPos: 0.65,
};

/** Rain day — based on class_96. */
const RAIN_DAY: CloudUniforms = {
  initShiftX: -0.5,
  initShiftY: 0,
  cloudDensity: 0.5,
  cloudSpeed: 0.003,
  cloudScale: 0.86,
  cloudDark: 0.2,
  cloudLight: 0.4,
  cloudCover: 0.58,
  cloudAlpha: 0.06,
  skyTint: 1,
  cloudType: 0,
  fdmCount: 5,
  rNoiseCount: 6,
  cNoiseCount: 5,
  uBottomFade: 0.72,
  uTopFade: 0,
  skyColor1: [0.176, 0.341, 0.384],
  skyColor2: [0.55, 0.65, 0.72],
  skyColorGradientPos: 0.7,
};

const OVERCAST: CloudUniforms = {
  ...RAIN_DAY,
  cloudCover: 0.75,
  cloudDensity: 0.7,
  cloudDark: 0.25,
  cloudAlpha: 0.1,
  skyColor1: [0.35, 0.4, 0.48],
  skyColor2: [0.55, 0.58, 0.62],
};

const PARTLY: CloudUniforms = {
  initShiftX: 0,
  initShiftY: 0,
  cloudDensity: 0.32,
  cloudSpeed: 0.0025,
  cloudScale: 0.75,
  cloudDark: 0.28,
  cloudLight: 0.5,
  cloudCover: 0.22,
  cloudAlpha: 0.1,
  skyTint: 1,
  cloudType: 0,
  fdmCount: 5,
  rNoiseCount: 6,
  cNoiseCount: 5,
  uBottomFade: 0.78,
  uTopFade: 0.05,
  // Keep sky tint muted so page never washes bright blue
  skyColor1: [0.22, 0.32, 0.42],
  skyColor2: [0.4, 0.48, 0.55],
  skyColorGradientPos: 0.5,
};

const FOG: CloudUniforms = {
  ...RAIN_DAY,
  cloudCover: 0.85,
  cloudDensity: 0.4,
  cloudAlpha: 0.15,
  cloudSpeed: 0.0015,
  cloudScale: 1.1,
  uBottomFade: 0.4,
  skyColor1: [0.55, 0.6, 0.65],
  skyColor2: [0.75, 0.78, 0.82],
};

export function cloudUniformsForCondition(
  condition: WeatherCondition,
  isDay = true,
): CloudUniforms {
  // Clear sky: no volumetric cloud bank
  if (condition === "clear" || condition === "heatwave") {
    return { ...PARTLY, hidden: true, cloudCover: 0, cloudAlpha: 0 };
  }

  switch (condition) {
    case "light_rain":
    case "heavy_rain":
    case "thunderstorm":
      return isDay ? { ...RAIN_DAY } : { ...RAIN_NIGHT };
    case "overcast":
      return {
        ...OVERCAST,
        ...(isDay
          ? {}
          : {
              skyColor1: RAIN_NIGHT.skyColor1,
              skyColor2: RAIN_NIGHT.skyColor2,
            }),
      };
    case "fog":
    case "haze":
      return { ...FOG };
    case "partly_cloudy":
    case "windy":
      return isDay
        ? { ...PARTLY }
        : {
            ...PARTLY,
            cloudCover: 0.18,
            cloudDensity: 0.22,
            cloudAlpha: 0.06,
            skyColor1: [0.06, 0.1, 0.18],
            skyColor2: [0.14, 0.2, 0.32],
          };
    case "snow":
      return {
        ...OVERCAST,
        cloudCover: 0.7,
        skyColor1: [0.55, 0.62, 0.72],
        skyColor2: [0.85, 0.9, 0.95],
      };
    default:
      return { ...PARTLY, hidden: true, cloudCover: 0 };
  }
}
