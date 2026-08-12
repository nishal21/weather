import type { CurrentWeather, DailyForecast } from "@/lib/weather/types";

/** One-line day narrative, day/night aware. */
export function daySummary(
  current: CurrentWeather,
  today?: DailyForecast,
): string {
  const highs = today
    ? `High ${Math.round(today.maxTempC)}°C`
    : `Around ${Math.round(current.temperatureC)}°C`;
  const lows = today ? `, low ${Math.round(today.minTempC)}°C` : "";
  const isDay = current.isDay ?? true;

  const lead = (() => {
    switch (current.condition) {
      case "clear":
        return isDay ? "Generally clear" : "Clear overnight";
      case "partly_cloudy":
        return isDay ? "Mix of sun and clouds" : "Partly cloudy overnight";
      case "overcast":
        return isDay ? "Mostly cloudy" : "Cloudy overnight";
      case "haze":
        return "Hazy conditions";
      case "fog":
        return "Foggy at times";
      case "light_rain":
        return isDay ? "Light rain expected" : "Light rain overnight";
      case "heavy_rain":
      case "thunderstorm":
        return isDay ? "Rain likely" : "Rain overnight";
      case "snow":
        return "Snow possible";
      case "heatwave":
        return "Very hot";
      case "windy":
        return "Windy";
      default:
        return current.conditionLabel;
    }
  })();

  return `${lead}. ${highs}${lows}.`;
}
