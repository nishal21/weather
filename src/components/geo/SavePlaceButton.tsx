"use client";

import { useEffect, useState } from "react";
import { BookmarkSimple } from "@phosphor-icons/react";
import type { LocationRef } from "@/lib/weather/types";
import {
  isPlaceSaved,
  toggleSavedPlace,
} from "@/lib/geo/saved-places";
import { useT } from "@/components/i18n/LocaleProvider";

type Props = {
  location: LocationRef;
};

/** Save / unsave the place shown in the hero. */
export function SavePlaceButton({ location }: Props) {
  const t = useT();
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(isPlaceSaved(location));
  }, [location]);

  useEffect(() => {
    const sync = () => setSaved(isPlaceSaved(location));
    window.addEventListener("saved-places-changed", sync);
    return () => window.removeEventListener("saved-places-changed", sync);
  }, [location]);

  if (!mounted) {
    return (
      <span
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 opacity-0"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
        saved
          ? "bg-sky-400/20 text-sky-200 hover:bg-sky-400/28"
          : "bg-white/10 text-white hover:bg-white/15"
      }`}
      aria-label={saved ? t("hero.removeSave") : t("hero.save")}
      aria-pressed={saved}
      title={saved ? t("hero.saved") : t("hero.save")}
      onClick={() => setSaved(toggleSavedPlace(location))}
    >
      <BookmarkSimple className="size-5" weight={saved ? "fill" : "bold"} />
    </button>
  );
}
