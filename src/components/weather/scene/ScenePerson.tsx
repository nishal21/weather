"use client";

import type { WeatherCondition } from "@/lib/weather/types";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
};

/**
 * Small mid-horizon silhouette (One UI composition) — walks in, then idles.
 * Not a giant blocky card figure.
 */
export function ScenePerson({ condition, isDay = true }: Props) {
  const rainy =
    condition === "light_rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm";
  const snowy = condition === "snow";
  const hazy = condition === "haze" || condition === "fog" || !isDay;
  const sunny =
    isDay &&
    (condition === "clear" ||
      condition === "partly_cloudy" ||
      condition === "heatwave");
  const cloak = hazy || (!isDay && !rainy);

  const body = rainy
    ? "#4f6fa8"
    : snowy
      ? "#64748b"
      : cloak
        ? "#6b5b95"
        : sunny
          ? condition === "heatwave"
            ? "#5eead4"
            : "#3d8b6e"
          : "#4a6741";
  const legs = rainy ? "#eab308" : cloak ? "#c4b5a0" : "#2f4f3a";
  const skin = "#d4a574";

  return (
    <g className="scene-person">
      <ellipse
        className="person-shadow"
        cx="0"
        cy="2"
        rx="10"
        ry="2.5"
        fill="rgba(0,0,0,0.22)"
      />

      <g className="person-rig">
        {/* legs */}
        <g className="leg leg-back">
          <path
            d="M-2.5 0 L-3.5 14 L0.5 14 L1 0 Z"
            fill={legs}
          />
        </g>
        <g className="leg leg-front">
          <path
            d="M2 0 L1.2 14 L5 14 L4.5 0 Z"
            fill={legs}
          />
        </g>

        {/* flowing cloak / coat (Samsung haze/night vibe) */}
        {cloak ? (
          <path
            className="cloak-sway"
            d="M-7 -16 Q-14 -4 -12 8 Q-4 4 0 6 Q6 4 10 9 Q12 -2 6 -16 Z"
            fill={body}
            opacity="0.95"
          />
        ) : null}

        {/* torso */}
        <path
          d={
            rainy
              ? "M-6 -18 Q-7 -2 -5 4 L5 4 Q7 -2 6 -18 Z"
              : "M-5.5 -18 Q-6.5 -2 -4.5 3 L4.5 3 Q6.5 -2 5.5 -18 Z"
          }
          fill={body}
        />

        {/* arms */}
        {!rainy && !snowy ? (
          <>
            <g className="arm arm-back">
              <path d="M-6 -14 L-9 0 L-6.5 1 L-4 -12 Z" fill={body} />
            </g>
            <g className="arm arm-front">
              {sunny ? (
                /* raised arm — phone / shade eyes */
                <path d="M5 -15 L10 -28 L12 -26 L7 -12 Z" fill={body} />
              ) : (
                <path d="M5.5 -14 L9 1 L6.5 2 L4 -12 Z" fill={body} />
              )}
            </g>
          </>
        ) : (
          <g className="arm arm-front">
            <path d="M4 -14 L7 -2 L5 0 L3 -12 Z" fill={body} />
          </g>
        )}

        {/* head */}
        <circle cx="0" cy="-22" r="5.2" fill={skin} />
        <path
          d="M-5 -24 Q0 -28 5 -24 Q5 -20 0 -19 Q-5 -20 -5 -24 Z"
          fill="#2a2118"
          opacity="0.9"
        />

        {/* umbrella */}
        {(rainy || snowy) && (
          <g className="umbrella" transform="translate(2 -26)">
            <line
              x1="0"
              y1="4"
              x2="0"
              y2="22"
              stroke="#1e293b"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              className="umbrella-canopy"
              d="M-16 5 Q0 -10 16 5 Q8 8 0 7 Q-8 8 -16 5 Z"
              fill={rainy ? "#2563eb" : "#94a3b8"}
            />
          </g>
        )}
      </g>
    </g>
  );
}
