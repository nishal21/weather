"use client";

import { useId } from "react";
import type { WeatherCondition } from "@/lib/weather/types";
import type { TempBand } from "@/lib/weather/scenes";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  tempBand?: TempBand;
};

/**
 * Mid-layer human character that walks in, then loops idle.
 * Outfit swaps by temperature band and weather context.
 */
export function WalkingCharacter({
  condition,
  isDay = true,
  tempBand = "average",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const rainy =
    condition === "light_rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm";
  const snowy = condition === "snow" || tempBand === "below0";
  const hot = tempBand === "over27" || condition === "heatwave";
  const cloak =
    !hot &&
    (!isDay ||
      condition === "haze" ||
      condition === "fog" ||
      condition === "overcast" ||
      tempBand === "below0");
  const sunny =
    isDay &&
    hot &&
    (condition === "clear" ||
      condition === "partly_cloudy" ||
      condition === "heatwave");

  const coat = rainy
    ? "#3b6ea8"
    : snowy && tempBand === "below0"
      ? "#5b6b82"
      : cloak
        ? "#6b5b95"
        : sunny
          ? condition === "heatwave"
            ? "#2dd4bf"
            : "#3d8b6e"
          : hot
            ? "#e8a87c"
            : "#4a6741";
  const coatDark = rainy
    ? "#234e7a"
    : cloak
      ? "#4a3d6b"
      : sunny
        ? "#2d6a4f"
        : hot
          ? "#c47850"
          : "#355239";
  const pants = rainy
    ? "#c9a227"
    : hot
      ? "#5b7c6a"
      : cloak
        ? "#c4b5a0"
        : "#2a4034";
  const skin = "#d4a574";
  const hair = "#2a2118";
  const coatId = `coat-${uid}`;
  const skinId = `skin-${uid}`;
  const umbId = `umb-${uid}`;
  const shadowId = `sh-${uid}`;

  return (
    <div className="scene-walker" data-band={tempBand} aria-hidden>
      <svg
        className="scene-walker-svg"
        viewBox="0 0 80 110"
        width="100%"
        height="100%"
        overflow="visible"
      >
        <defs>
          <linearGradient id={coatId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={coat} />
            <stop offset="100%" stopColor={coatDark} />
          </linearGradient>
          <linearGradient id={skinId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c4a8" />
            <stop offset="100%" stopColor={skin} />
          </linearGradient>
          <radialGradient id={umbId} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={rainy ? "#60a5fa" : "#cbd5e1"} />
            <stop offset="100%" stopColor={rainy ? "#1d4ed8" : "#64748b"} />
          </radialGradient>
          <filter id={shadowId} x="-40%" y="-20%" width="180%" height="160%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2.5"
              floodColor="#000"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <ellipse
          className="walker-shadow"
          cx="40"
          cy="102"
          rx="18"
          ry="4"
          fill="rgba(0,0,0,0.35)"
        />

        <g className="walker-rig" filter={`url(#${shadowId})`}>
          <g className="walker-leg walker-leg-back" transform="translate(34 68)">
            <path
              d={
                hot
                  ? "M0 0 Q-1 10 -2 22 L6 22 Q5 10 4 0 Z"
                  : "M0 0 Q-1 12 -2 28 L6 28 Q5 12 4 0 Z"
              }
              fill={pants}
            />
            <ellipse
              cx="2"
              cy={hot ? 24 : 30}
              rx="5"
              ry="2.2"
              fill="#1a1a1a"
            />
          </g>
          <g
            className="walker-leg walker-leg-front"
            transform="translate(42 68)"
          >
            <path
              d={
                hot
                  ? "M0 0 Q1 10 2 22 L10 22 Q8 10 6 0 Z"
                  : "M0 0 Q1 12 2 28 L10 28 Q8 12 6 0 Z"
              }
              fill={pants}
            />
            <ellipse
              cx="6"
              cy={hot ? 24 : 30}
              rx="5"
              ry="2.2"
              fill="#1a1a1a"
            />
          </g>

          {cloak && !rainy ? (
            <path
              className="walker-cloak"
              d="M28 38 Q18 55 20 78 Q30 72 40 74 Q50 72 60 80 Q62 55 52 38 Z"
              fill={`url(#${coatId})`}
              opacity="0.95"
            />
          ) : null}

          <path
            d={
              rainy
                ? "M29 36 Q27 55 30 70 L50 70 Q53 55 51 36 Z"
                : hot
                  ? "M31 38 Q29 52 32 62 L48 62 Q51 52 49 38 Z"
                  : "M30 36 Q28 54 31 68 L49 68 Q52 54 50 36 Z"
            }
            fill={`url(#${coatId})`}
          />

          {!rainy && !snowy ? (
            <>
              <g
                className="walker-arm walker-arm-back"
                transform="translate(28 42)"
              >
                <path d="M0 0 Q-6 10 -4 22 L2 22 Q0 10 3 2 Z" fill={coat} />
              </g>
              <g
                className="walker-arm walker-arm-front"
                transform="translate(52 42)"
              >
                {sunny ? (
                  <path
                    d="M0 0 Q8 -14 10 -18 L14 -14 Q8 -6 4 4 Z"
                    fill={coat}
                  />
                ) : (
                  <path d="M0 0 Q6 10 4 22 L10 22 Q8 10 5 2 Z" fill={coat} />
                )}
              </g>
            </>
          ) : (
            <g
              className="walker-arm walker-arm-front"
              transform="translate(50 44)"
            >
              <path d="M0 0 Q4 8 2 18 L8 18 Q6 8 4 0 Z" fill={coat} />
            </g>
          )}

          <circle cx="40" cy="26" r="11" fill={`url(#${skinId})`} />
          <path
            d="M29 22 Q40 12 51 22 Q51 28 40 30 Q29 28 29 22 Z"
            fill={hair}
          />
          {tempBand === "below0" ? (
            <path
              d="M28 32 Q40 38 52 32 Q48 40 40 42 Q32 40 28 32 Z"
              fill="#c45c4a"
              opacity="0.9"
            />
          ) : null}

          {(rainy || snowy) && (
            <g className="walker-umbrella" transform="translate(44 8)">
              <line
                x1="0"
                y1="12"
                x2="0"
                y2="42"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M-22 14 Q0 -8 22 14 Q10 18 0 16 Q-10 18 -22 14 Z"
                fill={`url(#${umbId})`}
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
