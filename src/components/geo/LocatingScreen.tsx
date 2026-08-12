"use client";

import { Suspense } from "react";
import { AutoLocate } from "@/components/geo/AutoLocate";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { useT } from "@/components/i18n/LocaleProvider";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { SeoAboutSection } from "@/components/seo/SeoAboutSection";
import { SeoFaqSection } from "@/components/seo/SeoFaqSection";
import { DEFAULT_LOCATION } from "@/lib/weather/locations/india-cities";

function WelcomeCopy() {
  const t = useT();
  return (
    <header className="welcome-header">
      <SiteLogo className="welcome-logo" width={80} height={80} />
      <p className="weather-panel-label">{t("welcome.label")}</p>
      <h1>{t("welcome.title")}</h1>
      <p className="welcome-sub">{t("welcome.sub")}</p>
    </header>
  );
}

function LocatingPanel() {
  return (
    <section
      className="search-modal-panel w-full overflow-hidden shadow-2xl"
      aria-label="Find a place"
    >
      <AutoLocate variant="inline" />
      <LocationSearch current={DEFAULT_LOCATION} layout="inner" />
    </section>
  );
}

export function LocatingScreen() {
  return (
    <div className="welcome-shell">
      <div className="welcome-shell-veil" aria-hidden />
      <main id="main-content" className="welcome-main">
        <WelcomeCopy />
        <Suspense fallback={null}>
          <LocatingPanel />
        </Suspense>
        <SeoAboutSection />
        <SeoFaqSection />
      </main>
    </div>
  );
}
