"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Crosshair, SpinnerGap } from "@phosphor-icons/react";
import {
  hrefForLocation,
  locateUserPlace,
  queryGeoPermission,
  readLastPlace,
  saveLastPlace,
  setGeoDenied,
  syncLastPlaceCookieFromStorage,
  wasGeoDenied,
} from "@/lib/geo/client";
import {
  locationRefFromQuery,
  parsePlaceParam,
} from "@/lib/geo/location-url";
import { useT } from "@/components/i18n/LocaleProvider";

type Status = "idle" | "locating" | "denied" | "error" | "done";

type Props = {
  /** Inline strip inside the welcome panel; no floating overlay. */
  variant?: "inline" | "floating";
};

/**
 * Auto-locates when permission is already granted, or restores last place.
 * First-time users get a clear “Use my location” panel (web.dev: explain before prompt).
 * After Allow, later visits locate automatically.
 */
export function AutoLocate({ variant = "floating" }: Props) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);
  const started = useRef(false);

  const hasCoords = Boolean(
    parsePlaceParam(searchParams.get("p")) ||
      (searchParams.get("lat") && searchParams.get("lon")),
  );
  const inline = variant === "inline";

  const applyPlace = (from: "gps" | "saved") => {
    setStatus("locating");
    setMessage(
      from === "gps" ? t("auto.lookingNearYou") : t("auto.openingLastPlace"),
    );
    startTransition(async () => {
      try {
        if (from === "saved") {
          const saved = readLastPlace();
          if (!saved) {
            setStatus("idle");
            return;
          }
          router.replace(hrefForLocation(saved, { from: "saved" }));
          setStatus("done");
          return;
        }
        const place = await locateUserPlace();
        setGeoDenied(false);
        saveLastPlace(place);
        router.replace(hrefForLocation(place, { from: "gps" }));
        setStatus("done");
      } catch (err) {
        const code =
          err && typeof err === "object" && "code" in err
            ? Number((err as GeolocationPositionError).code)
            : 0;
        if (code === 1) {
          setGeoDenied(true);
          setStatus("denied");
          setMessage(
            t("auto.locationOff"),
          );
        } else {
          setStatus("error");
          setMessage(t("auto.couldNotGetLocation"));
        }
      }
    });
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (pathname !== "/") return;

    if (hasCoords) {
      const fromQuery = locationRefFromQuery({
        p: searchParams.get("p") ?? undefined,
        lat: searchParams.get("lat") ?? undefined,
        lon: searchParams.get("lon") ?? undefined,
        n: searchParams.get("n") ?? undefined,
        name: searchParams.get("name") ?? undefined,
        st: searchParams.get("st") ?? undefined,
        state: searchParams.get("state") ?? undefined,
        cc: searchParams.get("cc") ?? undefined,
        l: searchParams.get("l") ?? undefined,
        location: searchParams.get("location") ?? undefined,
        f: searchParams.get("f") ?? undefined,
        from: searchParams.get("from") ?? undefined,
      });
      if (fromQuery) {
        saveLastPlace(fromQuery);
      }
      setStatus("done");
      return;
    }

    (async () => {
      syncLastPlaceCookieFromStorage();

      const cached = readLastPlace();
      if (cached) {
        applyPlace("saved");
        return;
      }

      const permission = await queryGeoPermission();

      if (permission === "granted") {
        applyPlace("gps");
        return;
      }

      if (permission === "denied" || wasGeoDenied()) {
        setStatus("denied");
        setMessage(t("auto.searchBelow"));
        return;
      }

      setStatus("locating");
      setMessage(t("auto.tapAllow"));
      applyPlace("gps");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for auto-locate
  }, []);

  const busy = status === "locating" || pending;
  const showPanel = !hasCoords && status !== "done" && !dismissed;

  if (!showPanel) {
    return null;
  }

  const dismissToSearch = () => {
    setDismissed(true);
    setStatus("done");
    requestAnimationFrame(() => {
      document.getElementById("place-search")?.focus();
    });
  };

  const title =
    busy
      ? t("auto.findingYou")
      : status === "denied"
        ? t("auto.locationUnavailable")
        : t("hero.nearYou");

  if (inline) {
    return (
      <div
        className="border-b border-white/10 bg-white/[0.03] px-4 py-3.5"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
            {busy ? (
              <SpinnerGap className="size-4 animate-spin" aria-hidden />
            ) : (
              <Crosshair className="size-4" weight="bold" aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-white">{title}</p>
            <p className="mt-0.5 break-words text-[13px] leading-snug text-white/50">
              {message ||
                t("auto.weReadOnce")}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {!busy && status !== "denied" ? (
                <button
                  type="button"
                  onClick={() => applyPlace("gps")}
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3.5 text-[13px] font-medium text-white transition hover:border-sky-400/25 hover:bg-sky-400/10 active:scale-[0.99]"
                >
                  <Crosshair className="size-3.5" weight="bold" aria-hidden />
                  {t("auto.useMyLocation")}
                </button>
              ) : null}
              {busy ? (
                <button
                  type="button"
                  onClick={dismissToSearch}
                  className="text-[13px] font-medium text-sky-300/90 transition hover:text-sky-200"
                >
                  {t("auto.searchCityInstead")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-auto sm:top-24 sm:left-1/2 sm:max-w-md sm:-translate-x-1/2"
      role="status"
      aria-live="polite"
    >
      <div className="search-modal-panel overflow-hidden p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
            {busy ? (
              <SpinnerGap className="size-5 animate-spin" aria-hidden />
            ) : (
              <Crosshair className="size-5" weight="bold" aria-hidden />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-white">{title}</p>
            <p className="mt-1 break-words text-sm leading-relaxed text-white/50">
              {message || t("auto.searchCityBelow")}
            </p>
          </div>
        </div>
        {!busy ? (
          <button
            type="button"
            onClick={() => applyPlace("gps")}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Crosshair className="size-4" weight="bold" aria-hidden />
            {t("auto.useMyLocation")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
