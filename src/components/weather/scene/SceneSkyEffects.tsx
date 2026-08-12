"use client";

import type { WeatherCondition } from "@/lib/weather/types";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  uid: string;
};

export function SceneSkyEffects({ condition, isDay = true, uid }: Props) {
  const rainy =
    condition === "light_rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm";
  const heavy = condition === "heavy_rain" || condition === "thunderstorm";
  const showClouds =
    condition !== "clear" || !isDay;
  const showSun =
    isDay &&
    (condition === "clear" ||
      condition === "partly_cloudy" ||
      condition === "heatwave");
  const showMoon =
    !isDay &&
    (condition === "clear" || condition === "partly_cloudy" || condition === "overcast");
  const showFog =
    condition === "fog" || condition === "haze" || (rainy && heavy);
  const showSnow = condition === "snow";
  const showWind = condition === "windy";
  const showStorm = condition === "thunderstorm";
  const brightClear = isDay && (condition === "clear" || condition === "heatwave");

  const rainCount = heavy ? 48 : rainy ? 32 : 0;

  return (
    <g className="sky-effects">
      {showSun ? (
        <g className="sun-group" transform="translate(340 72)">
          <circle className="sun-core" r="28" fill="#fff7b2" />
          <circle className="sun-glow" r="48" fill="#fde68a" opacity="0.35" />
          <circle className="sun-glow-outer" r="78" fill="#fef08a" opacity="0.12" />
          {brightClear ? (
            <g className="lens-flare" opacity="0.55">
              <ellipse
                cx="40"
                cy="50"
                rx="90"
                ry="4"
                fill="white"
                transform="rotate(28)"
              />
              <circle cx="70" cy="55" r="6" fill="white" opacity="0.5" />
              <circle cx="110" cy="70" r="3.5" fill="#fde68a" opacity="0.6" />
            </g>
          ) : null}
        </g>
      ) : null}

      {showMoon ? (
        <g transform="translate(360 64)">
          <circle r="22" fill="#e2e8f0" />
          <circle cx="8" cy="-5" r="18" fill="#0f172a" opacity="0.45" />
        </g>
      ) : null}

      {showClouds ? (
        <>
          <g className="cloud cloud-far" transform="translate(20 36) scale(1.35)">
            <Cloud fill={isDay ? "rgba(255,255,255,0.55)" : "rgba(100,116,139,0.45)"} />
          </g>
          <g className="cloud cloud-mid" transform="translate(180 22) scale(1.6)">
            <Cloud
              fill={
                rainy || !isDay
                  ? "rgba(71,85,105,0.7)"
                  : "rgba(255,255,255,0.72)"
              }
            />
          </g>
          <g className="cloud cloud-near" transform="translate(320 48) scale(1.15)">
            <Cloud fill={isDay ? "rgba(241,245,249,0.65)" : "rgba(51,65,85,0.65)"} />
          </g>
        </>
      ) : null}

      {showFog ? (
        <>
          <ellipse
            className="fog-layer fog-a"
            cx="180"
            cy="168"
            rx="220"
            ry="28"
            fill="rgba(226,232,240,0.28)"
          />
          <ellipse
            className="fog-layer fog-b"
            cx="300"
            cy="188"
            rx="200"
            ry="24"
            fill="rgba(226,232,240,0.22)"
          />
          <ellipse
            className="fog-layer fog-c"
            cx="120"
            cy="200"
            rx="180"
            ry="20"
            fill="rgba(203,213,225,0.2)"
          />
        </>
      ) : null}

      {/* Back rain (slower, thinner) */}
      {rainy
        ? Array.from({ length: Math.floor(rainCount / 2) }).map((_, i) => (
            <line
              key={`rb-${i}`}
              className="rain-back"
              x1={8 + ((i * 29) % 460)}
              y1={-30}
              x2={2 + ((i * 29) % 460)}
              y2={18}
              stroke="rgba(186,230,253,0.35)"
              strokeWidth="1"
              strokeLinecap="round"
              style={{ animationDelay: `${(i % 10) * 0.11}s`, animationDuration: `${1.35 + (i % 5) * 0.12}s` }}
            />
          ))
        : null}

      {/* Front rain */}
      {rainy
        ? Array.from({ length: Math.ceil(rainCount / 2) }).map((_, i) => (
            <line
              key={`rf-${i}`}
              className="rain-front"
              x1={16 + ((i * 31) % 450)}
              y1={-40}
              x2={8 + ((i * 31) % 450)}
              y2={22}
              stroke="rgba(224,242,254,0.7)"
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{ animationDelay: `${(i % 8) * 0.09}s`, animationDuration: `${0.75 + (i % 4) * 0.08}s` }}
            />
          ))
        : null}

      {/* Ground splash dots when raining */}
      {rainy
        ? Array.from({ length: 10 }).map((_, i) => (
            <ellipse
              key={`sp-${i}`}
              className="rain-splash"
              cx={40 + i * 42}
              cy={228}
              rx="3"
              ry="1.2"
              fill="rgba(186,230,253,0.45)"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
          ))
        : null}

      {showSnow
        ? Array.from({ length: 26 }).map((_, i) => (
            <circle
              key={`sn-${i}`}
              className="snow-flake"
              cx={20 + ((i * 37) % 440)}
              cy={-(i % 7) * 10}
              r={1.2 + (i % 3) * 0.6}
              fill="white"
              opacity="0.85"
              style={{ animationDelay: `${(i % 12) * 0.2}s`, animationDuration: `${2.8 + (i % 5) * 0.4}s` }}
            />
          ))
        : null}

      {showWind
        ? [0, 1, 2, 3, 4].map((i) => (
            <path
              key={`w-${i}`}
              className="wind-line"
              d={`M${30 + i * 18} ${70 + i * 22} q 50 -10 100 4`}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          ))
        : null}

      {showStorm ? (
        <path
          className="lightning"
          d="M268 28 L248 95 L268 95 L246 168"
          fill="none"
          stroke="#fef9c3"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${uid}-glow)`}
        />
      ) : null}
    </g>
  );
}

function Cloud({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <ellipse cx="36" cy="20" rx="36" ry="16" />
      <ellipse cx="14" cy="24" rx="20" ry="12" />
      <ellipse cx="58" cy="22" rx="22" ry="14" />
      <ellipse cx="36" cy="12" rx="26" ry="14" />
    </g>
  );
}
