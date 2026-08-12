"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherCondition } from "@/lib/weather/types";
import type { IndiaSeason } from "@/lib/weather/season";
import {
  fallbackVideoSrc,
  videoSrcForCondition,
} from "@/lib/weather/conditions";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  season: IndiaSeason;
  className?: string;
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
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g")
    return true;
  return false;
}

/**
 * Hero sky atmosphere video — swaps with weather + season.
 * Loops softly (sky only); character walk stays one-shot elsewhere.
 */
export function WeatherSkyVideo({
  condition,
  isDay = true,
  season,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(() =>
    videoSrcForCondition(condition, isDay, season),
  );
  const [staticOnly, setStaticOnly] = useState(false);

  useEffect(() => {
    setStaticOnly(prefersReducedMotion() || saveDataEnabled());
  }, []);

  useEffect(() => {
    setSrc(videoSrcForCondition(condition, isDay, season));
  }, [condition, isDay, season]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || staticOnly) return;
    el.load();
    const play = el.play();
    if (play) play.catch(() => setStaticOnly(true));
  }, [src, staticOnly]);

  if (staticOnly) return null;

  return (
    <div className={`ws-sky-video-wrap ${className}`} aria-hidden="true">
      <video
        ref={videoRef}
        key={src}
        className="ws-sky-video"
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setSrc(fallbackVideoSrc())}
      />
      <div className="ws-sky-video-scrim" />
    </div>
  );
}
