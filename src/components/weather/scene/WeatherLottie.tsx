"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type Props = {
  src: string;
  className?: string;
};

/** Plays classic Bodymovin JSON from /public/lottie. */
export function WeatherLottie({ src, className }: Props) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Lottie ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!data) {
    return <div className={className} aria-hidden />;
  }

  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      className={className}
      style={{ width: "100%", height: "100%" }}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
