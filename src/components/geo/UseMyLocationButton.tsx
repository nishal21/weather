"use client";

import { Suspense, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Crosshair, SpinnerGap } from "@phosphor-icons/react";
import {
  hrefForLocation,
  locateUserPlace,
  saveLastPlace,
  setGeoDenied,
} from "@/lib/geo/client";

export function UseMyLocationButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Use my location"
      title="Use my location"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 active:scale-[0.98] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      onClick={() => {
        startTransition(async () => {
          try {
            const place = await locateUserPlace();
            setGeoDenied(false);
            saveLastPlace(place);
            router.replace(hrefForLocation(place, { from: "gps" }));
          } catch {
            setGeoDenied(true);
            document.getElementById("place-search")?.focus();
          }
        });
      }}
    >
      {pending ? (
        <SpinnerGap className="size-5 animate-spin" aria-hidden />
      ) : (
        <Crosshair className="size-5" weight="bold" aria-hidden />
      )}
    </button>
  );
}

export function UseMyLocationButtonSafe() {
  return (
    <Suspense fallback={null}>
      <UseMyLocationButton />
    </Suspense>
  );
}
