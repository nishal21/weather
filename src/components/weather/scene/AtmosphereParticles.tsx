"use client";

import { useEffect, useRef } from "react";
import type { WeatherCondition } from "@/lib/weather/types";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  r: number;
};

/** Canvas particle layer — rain/snow/fog depth like a lightweight 3D pass. */
export function AtmosphereParticles({ condition, isDay = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rainy =
      condition === "light_rain" ||
      condition === "heavy_rain" ||
      condition === "thunderstorm";
    const heavy = condition === "heavy_rain" || condition === "thunderstorm";
    const snowy = condition === "snow";
    const foggy = condition === "fog" || condition === "haze";
    const windy = condition === "windy";

    let raf = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? 480;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const spawn = () => {
      const count = rainy
        ? heavy
          ? 120
          : 70
        : snowy
          ? 55
          : foggy
            ? 24
            : windy
              ? 18
              : isDay
                ? 12
                : 8;
      particles = Array.from({ length: count }, () => reset({} as Particle, true));
    };

    const reset = (p: Particle, randomY: boolean): Particle => {
      p.x = Math.random() * w;
      p.y = randomY ? Math.random() * h : -20;
      if (rainy) {
        p.vx = heavy ? -2.2 : -1.2;
        p.vy = heavy ? 14 + Math.random() * 8 : 9 + Math.random() * 5;
        p.len = 10 + Math.random() * 14;
        p.alpha = 0.25 + Math.random() * 0.45;
        p.r = 0;
      } else if (snowy) {
        p.vx = -0.4 + Math.random() * 0.8;
        p.vy = 0.6 + Math.random() * 1.4;
        p.len = 0;
        p.alpha = 0.5 + Math.random() * 0.4;
        p.r = 1 + Math.random() * 2.5;
      } else if (foggy) {
        p.vx = 0.15 + Math.random() * 0.25;
        p.vy = 0;
        p.len = 80 + Math.random() * 140;
        p.alpha = 0.04 + Math.random() * 0.08;
        p.r = 30 + Math.random() * 50;
        p.y = h * 0.35 + Math.random() * h * 0.45;
      } else {
        // dust / light motes
        p.vx = windy ? 1.5 + Math.random() : 0.1;
        p.vy = -0.15 + Math.random() * 0.3;
        p.len = 0;
        p.alpha = 0.15 + Math.random() * 0.25;
        p.r = 0.8 + Math.random() * 1.6;
      }
      return p;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      if (condition === "thunderstorm") {
        if (Math.random() < 0.008) {
          ctx.fillStyle = "rgba(255,255,220,0.18)";
          ctx.fillRect(0, 0, w, h);
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 30 || p.x < -40 || p.x > w + 40) reset(p, false);

        if (rainy) {
          ctx.strokeStyle = `rgba(186,230,253,${p.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.2, p.y + p.len);
          ctx.stroke();
        } else if (snowy) {
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (foggy) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(226,232,240,${p.alpha})`);
          g.addColorStop(1, "rgba(226,232,240,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = isDay
            ? `rgba(255,255,255,${p.alpha})`
            : `rgba(226,232,240,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [condition, isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      aria-hidden
    />
  );
}
