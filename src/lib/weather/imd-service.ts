import type { WeatherProvider, WeatherSnapshot } from "./types";

/**
 * IMD provider stub – swap in when API key is available.
 * Keep UI on WeatherSnapshot; map IMD JSON in mappers/imd*.ts only.
 */
export class ImdWeatherService implements WeatherProvider {
  async getSnapshot(_locationId: string): Promise<WeatherSnapshot> {
    throw new Error(
      "IMD provider is not configured yet. Set WEATHER_DATA_SOURCE=open-meteo until your API key is ready.",
    );
  }
}
