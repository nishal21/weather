"use client";

import { Suspense } from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { LocationRef } from "@/lib/weather/types";
import { LocationSearch } from "./LocationSearch";
import { UseMyLocationButton } from "@/components/geo/UseMyLocationButton";

type Props = {
  location: LocationRef;
  nearYou?: boolean;
};

function HeaderActions() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <UseMyLocationButton />
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition active:scale-[0.98] hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        onClick={() => router.refresh()}
        aria-label="Refresh weather"
      >
        <ArrowClockwise className="size-5" weight="bold" />
      </button>
    </div>
  );
}

export function AppHeader({ location, nearYou }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold tracking-tight text-white">
              STRATEN
            </p>
            <p className="truncate text-xs text-zinc-400">
              {nearYou
                ? "Showing forecast near you"
                : "Live forecast · plain-language alerts"}
            </p>
          </div>
          <Suspense fallback={null}>
            <HeaderActions />
          </Suspense>
        </div>
        <LocationSearch current={location} />
      </div>
    </header>
  );
}
