"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { WeatherCondition } from "@/lib/weather/types";
import type { IndiaSeason } from "@/lib/weather/season";
import { groundSrcForCondition, scenePalette } from "@/lib/weather/scenes";
import { AtmosphereParticles } from "@/components/weather/scene/AtmosphereParticles";
import { HumanPlate } from "@/components/weather/scene/HumanPlate";
import { CloudCanvas } from "@/components/weather/scene/CloudCanvas";
import { cloudUniformsForCondition } from "@/lib/weather/cloud-canvas";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  temperatureC?: number;
  season: IndiaSeason;
  sceneKey: string;
  className?: string;
  immersive?: boolean;
};

/** Hero: volumetric clouds, hills, and character. */
export function WeatherScene({
  condition,
  isDay = true,
  season,
  sceneKey,
  className = "",
  immersive = false,
}: Props) {
  const palette = scenePalette(condition, isDay);
  const near = groundSrcForCondition(condition, isDay, "near", season);
  const far = groundSrcForCondition(condition, isDay, "far", season);
  const needsClouds = !cloudUniformsForCondition(condition, isDay).hidden;
  const [sceneReady, setSceneReady] = useState(!needsClouds);
  const [groundsReady, setGroundsReady] = useState(false);

  useEffect(() => {
    setSceneReady(!needsClouds);
    setGroundsReady(false);
    let left = 2;
    const done = () => {
      left -= 1;
      if (left <= 0) setGroundsReady(true);
    };
    const mark = (src: string) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    };
    mark(far);
    mark(near);
  }, [far, near, needsClouds, sceneKey]);

  const onCloudReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const revealed = sceneReady && groundsReady;

  return (
    <div
      key={sceneKey}
      className={
        immersive
          ? `weather-scene weather-scene--immersive pointer-events-none absolute inset-0 overflow-hidden ${className}`
          : `weather-scene relative h-[min(52vw,22rem)] w-full overflow-hidden sm:h-[24rem] ${className}`
      }
      aria-hidden="true"
      style={
        {
          "--sky-top": palette.skyTop,
          "--sky-mid": palette.skyMid,
          "--sky-bot": palette.skyBot,
        } as CSSProperties
      }
    >
      <div
        className={`ws-scene-layers${revealed ? " ws-scene-layers--ready" : ""}`}
      >
        <div className="ws-sky" />
        <CloudCanvas
          condition={condition}
          isDay={isDay}
          onReady={onCloudReady}
        />
        <div
          className={`ws-orb ${isDay ? "ws-orb--day" : "ws-orb--night"}`}
          style={{ width: isDay ? "min(40%, 17rem)" : "min(28%, 12rem)" }}
        />

        <div
          className="ws-land ws-land--far"
          style={{ backgroundImage: `url("${far}")` }}
        />

        <div className="ws-human ws-human--enter">
          <HumanPlate />
        </div>

        <AtmosphereParticles condition={condition} isDay={isDay} />

        <div
          className="ws-land ws-land--near"
          style={{ backgroundImage: `url("${near}")` }}
        />

        <div className="ws-fade" />
      </div>

      {/* Blocks viewing incomplete fog/clouds popping in over the landscape */}
      <div
        className={`ws-scene-veil${revealed ? " ws-scene-veil--gone" : ""}`}
        style={{ background: palette.skyMid }}
        aria-hidden
      />
    </div>
  );
}
