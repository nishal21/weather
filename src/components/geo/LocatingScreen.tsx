"use client";

import { Suspense } from "react";
import { AutoLocate } from "@/components/geo/AutoLocate";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { useT } from "@/components/i18n/LocaleProvider";
import { SeoFaqSection } from "@/components/seo/SeoFaqSection";
import { DEFAULT_LOCATION } from "@/lib/weather/locations/india-cities";

function WelcomeCopy() {
  const t = useT();
  return (
    <div className="mb-5 text-center">
      <p className="weather-panel-label mb-2">{t("welcome.label")}</p>
      <h1 className="font-display text-[1.65rem] font-semibold tracking-tight text-white sm:text-3xl">
        {t("welcome.title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        {t("welcome.sub")}
      </p>
    </div>
  );
}

function LocatingPanel() {
  return (
    <div className="search-modal-panel w-full overflow-hidden shadow-2xl">
      <AutoLocate variant="inline" />
      <LocationSearch current={DEFAULT_LOCATION} layout="inner" />
    </div>
  );
}

export function LocatingScreen() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-[#0a121c] via-[#0b1410] to-[#070b12]">
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-[#070b12]/80"
        aria-hidden
      />
      <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
        <WelcomeCopy />
        <Suspense fallback={null}>
          <LocatingPanel />
        </Suspense>
        <SeoFaqSection />
      </main>
    </div>
  );
}
