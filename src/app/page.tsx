import type { Metadata } from "next";
import { WeatherAppScreen } from "@/components/weather/WeatherAppScreen";
import { AutoLocate } from "@/components/geo/AutoLocate";
import { LocatingScreen } from "@/components/geo/LocatingScreen";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchWeatherSnapshot } from "@/lib/weather/provider";
import { deriveAlerts } from "@/lib/weather/derive-alerts";
import { DEFAULT_LOCATION } from "@/lib/weather/locations/india-cities";
import {
  hasPlaceInQuery,
  isNearYouQuery,
  locationRefFromQuery,
  type LocationQueryParams,
} from "@/lib/geo/location-url";
import { getServerLocale } from "@/lib/i18n/server";
import {
  localizeAlertsCopy,
  localizeDaySummaryText,
} from "@/lib/i18n/localize-snapshot";
import {
  locationMetadata,
  welcomeMetadata,
} from "@/lib/seo/metadata";
import { weatherPageJsonLd } from "@/lib/seo/json-ld";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<LocationQueryParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  if (!hasPlaceInQuery(params)) return welcomeMetadata();

  const place = locationRefFromQuery(params);
  if (!place || place.name === "Selected place" || place.name === "Near you") {
    return welcomeMetadata();
  }

  return locationMetadata(place);
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const nearYou = isNearYouQuery(params);
  const hasPlace = hasPlaceInQuery(params);

  if (!hasPlace) {
    return <LocatingScreen />;
  }

  let snapshot;
  let error: string | null = null;
  try {
    snapshot = await fetchWeatherSnapshot(params, locale);
  } catch {
    error = "Weather didn't load. Try again.";
  }

  if (error || !snapshot) {
    return (
      <>
        <Suspense fallback={null}>
          <AutoLocate />
        </Suspense>
        <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-gradient-to-b from-[#0a121c] via-[#0b1410] to-[#070b12] px-4">
          <div role="alert" className="relative z-10 w-full max-w-xl">
            <div className="search-modal-panel overflow-hidden p-5 shadow-2xl">
              <h1 className="text-xl font-semibold text-white">
                Couldn&apos;t load weather
              </h1>
              <p className="mt-2 text-sm text-white/55">{error}</p>
            </div>
            <div className="mt-3">
              <LocationSearch current={DEFAULT_LOCATION} layout="standalone" />
            </div>
          </div>
        </div>
      </>
    );
  }

  const derived = deriveAlerts(snapshot);
  const localized = await localizeAlertsCopy(
    derived.alerts,
    derived.tips,
    locale,
  );
  const todaySummary = await localizeDaySummaryText(snapshot, locale);

  return (
    <>
      <JsonLd data={weatherPageJsonLd(snapshot.location, snapshot)} />
      <Suspense fallback={null}>
        <AutoLocate />
      </Suspense>
      <WeatherAppScreen
        snapshot={snapshot}
        nearYou={nearYou}
        tips={localized.tips}
        alerts={localized.alerts}
        todaySummary={todaySummary}
      />
    </>
  );
}
