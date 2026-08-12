"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherCondition } from "@/lib/weather/types";
import type { IndiaSeason } from "@/lib/weather/season";
import { indiaSeasonFromDate } from "@/lib/weather/season";
import { fallbackVideoSrc, videoSrcForCondition } from "@/lib/weather/conditions";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  season?: IndiaSeason;
  observedAt?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function saveDataEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return true;
  return false;
}

/** Full-page fallback sky video (season + weather aware). */
export function WeatherVideoBackground({
  condition,
  isDay = true,
  season,
  observedAt,
}: Props) {
  const resolvedSeason =
    season ?? indiaSeasonFromDate(observedAt ?? new Date());
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(() =>
    videoSrcForCondition(condition, isDay, resolvedSeason),
  );
  const [staticOnly, setStaticOnly] = useState(false);

  useEffect(() => {
    setStaticOnly(prefersReducedMotion() || saveDataEnabled());
  }, []);

  useEffect(() => {
    setSrc(videoSrcForCondition(condition, isDay, resolvedSeason));
  }, [condition, isDay, resolvedSeason]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || staticOnly) return;
    el.load();
    const play = el.play();
    if (play) play.catch(() => setStaticOnly(true));
  }, [src, staticOnly]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {!staticOnly ? (
        <video
          ref={videoRef}
          key={src}
          className="h-full w-full scale-105 object-cover"
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setSrc(fallbackVideoSrc())}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950" />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
    </div>
  );
}
