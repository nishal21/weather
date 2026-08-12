"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = { className?: string };

/**
 * Character walk-in from the right once, then freezes in place.
 * No infinite loop.
 */
export function HumanPlate({ className = "" }: Props) {
  const [useSprite, setUseSprite] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnd = () => el.classList.add("ws-human-sprite--settled");
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, [useSprite]);

  if (!useSprite) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/scenes/apk/human-clean.webp"
        alt=""
        className={`ws-human-media ${className}`}
        decoding="async"
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`ws-human-sprite ${className}`}
      style={
        {
          "--hs-sheet": 'url("/scenes/apk/human-sheet.webp")',
        } as CSSProperties
      }
      role="presentation"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/scenes/apk/human-clean.webp"
        alt=""
        className="sr-only"
        onError={() => setUseSprite(false)}
      />
    </div>
  );
}
