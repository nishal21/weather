import type {
  AstronomyDay,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  LocationRef,
  WeatherSnapshot,
} from "../types";
import { mapWmoCodeToCondition, resolveIsDay, wmoConditionLabel } from "../wmo";

interface OpenMeteoResponse {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    pressure_msl: number;
    precipitation: number;
    is_day: number;
    cloud_cover: number;
    dew_point_2m?: number;
    visibility?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    precipitation_probability: (number | null)[];
    weather_code: number[];
    wind_speed_10m: number[];
    uv_index?: (number | null)[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

export function mapOpenMeteoToSnapshot(
  data: OpenMeteoResponse,
  location: LocationRef,
): WeatherSnapshot {
  const cur = data.current;
  if (!cur) {
    throw new Error("Open-Meteo response missing current weather");
  }

  const wmo = cur.weather_code;
  const condition = mapWmoCodeToCondition(wmo, {
    temperatureC: cur.temperature_2m,
    windSpeedKmph: cur.wind_speed_10m,
  });

  const current: CurrentWeather = {
    observedAt: cur.time,
    temperatureC: Math.round(cur.temperature_2m),
    feelsLikeC: Math.round(cur.apparent_temperature),
    humidityPct: Math.round(cur.relative_humidity_2m),
    windSpeedKmph: Math.round(cur.wind_speed_10m),
    windDirectionDeg: cur.wind_direction_10m,
    pressureHpa: Math.round(cur.pressure_msl),
    rainfallLast24hMm: 0,
    dewPointC:
      cur.dew_point_2m != null ? Math.round(cur.dew_point_2m) : undefined,
    visibilityKm:
      cur.visibility != null
        ? Number((cur.visibility / 1000).toFixed(1))
        : undefined,
    condition,
    conditionLabel:
      condition === "heatwave" ? "Heatwave conditions" : wmoConditionLabel(wmo),
    wmoCode: wmo,
    isDay: cur.is_day === 1,
    nebulosity: Math.round(cur.cloud_cover / 12.5),
  };

  const hourly48: HourlyForecast[] = [];
  if (data.hourly) {
    const start = data.hourly.time.findIndex((t) => t >= cur.time);
    const from = start >= 0 ? start : 0;
    const curIdx = data.hourly.time.findIndex((t) => t === cur.time);
    const endIdx = curIdx >= 0 ? curIdx : Math.max(0, from - 1);
    const rainFrom = Math.max(0, endIdx - 23);
    let rain24 = 0;
    for (let i = rainFrom; i <= endIdx; i++) {
      rain24 += data.hourly.precipitation[i] ?? 0;
    }
    current.rainfallLast24hMm = Number(rain24.toFixed(1));

    for (let i = from; i < Math.min(from + 48, data.hourly.time.length); i++) {
      const code = data.hourly.weather_code[i];
      hourly48.push({
        time: data.hourly.time[i],
        temperatureC: Math.round(data.hourly.temperature_2m[i]),
        precipitationMm: Number(data.hourly.precipitation[i].toFixed(1)),
        precipitationProbabilityPct:
          data.hourly.precipitation_probability[i] ?? undefined,
        condition: mapWmoCodeToCondition(code, {
          temperatureC: data.hourly.temperature_2m[i],
          windSpeedKmph: data.hourly.wind_speed_10m[i],
        }),
        conditionLabel: wmoConditionLabel(code),
        windSpeedKmph: Math.round(data.hourly.wind_speed_10m[i]),
        uvIndex:
          data.hourly.uv_index?.[i] != null
            ? Number(Number(data.hourly.uv_index[i]).toFixed(1))
            : undefined,
        wmoCode: code,
      });
    }
  } else {
    current.rainfallLast24hMm = Number(cur.precipitation.toFixed(1));
  }

  const forecast7: DailyForecast[] = [];
  let astronomy: AstronomyDay | undefined;
  let uvIndexMax: number | undefined;

  if (data.daily) {
    for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
      const code = data.daily.weather_code[i];
      forecast7.push({
        date: data.daily.time[i],
        maxTempC: Math.round(data.daily.temperature_2m_max[i]),
        minTempC: Math.round(data.daily.temperature_2m_min[i]),
        condition: mapWmoCodeToCondition(code, {
          temperatureC: data.daily.temperature_2m_max[i],
        }),
        conditionLabel: wmoConditionLabel(code),
        rainChancePct: data.daily.precipitation_probability_max[i] ?? undefined,
        precipitationSumMm: Number(data.daily.precipitation_sum[i].toFixed(1)),
        wmoCode: code,
      });
    }
    astronomy = {
      date: data.daily.time[0],
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    };
    uvIndexMax = Number(data.daily.uv_index_max[0].toFixed(1));
  }

  // Samsung-accurate day/night: sunrise/sunset beats stale is_day flags
  current.isDay = resolveIsDay({
    observedAt: current.observedAt,
    apiIsDay: cur.is_day === 1,
    sunrise: astronomy?.sunrise,
    sunset: astronomy?.sunset,
  });

  return {
    location,
    current,
    hourly48,
    forecast7,
    astronomy,
    uvIndexMax,
    alerts: [],
    provider: "open-meteo",
    fetchedAt: new Date().toISOString(),
    attribution: "Weather data: Open-Meteo (CC BY 4.0)",
  };
}
