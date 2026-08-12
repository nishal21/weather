"use client";

import { useEffect, useRef } from "react";
import type { WeatherCondition } from "@/lib/weather/types";
import {
  cloudUniformsForCondition,
  type CloudUniforms,
} from "@/lib/weather/cloud-canvas";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  onReady?: () => void;
};

/** WebGL volumetric cloud layer (AGSL CLOUD_CANVAS port). */
export function CloudCanvas({
  condition,
  isDay = true,
  onReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const key = `${condition}-${isDay ? "day" : "night"}`;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const uniforms = cloudUniformsForCondition(condition, isDay);
    if (uniforms.hidden) {
      onReadyRef.current?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) {
      onReadyRef.current?.();
      return;
    }

    const vs = compile(
      gl,
      gl.VERTEX_SHADER,
      `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `,
    );
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) {
      onReadyRef.current?.();
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      onReadyRef.current?.();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onReadyRef.current?.();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      iResolution: gl.getUniformLocation(prog, "iResolution"),
      iTime: gl.getUniformLocation(prog, "iTime"),
      initShiftX: gl.getUniformLocation(prog, "initShiftX"),
      initShiftY: gl.getUniformLocation(prog, "initShiftY"),
      cloudDensity: gl.getUniformLocation(prog, "cloudDensity"),
      cloudSpeed: gl.getUniformLocation(prog, "cloudSpeed"),
      cloudScale: gl.getUniformLocation(prog, "cloudScale"),
      cloudDark: gl.getUniformLocation(prog, "cloudDark"),
      cloudLight: gl.getUniformLocation(prog, "cloudLight"),
      cloudCover: gl.getUniformLocation(prog, "cloudCover"),
      cloudAlpha: gl.getUniformLocation(prog, "cloudAlpha"),
      skyTint: gl.getUniformLocation(prog, "skyTint"),
      cloudType: gl.getUniformLocation(prog, "cloudType"),
      fdmCount: gl.getUniformLocation(prog, "fdmCount"),
      rNoiseCount: gl.getUniformLocation(prog, "rNoiseCount"),
      cNoiseCount: gl.getUniformLocation(prog, "cNoiseCount"),
      uBottomFade: gl.getUniformLocation(prog, "uBottomFade"),
      uTopFade: gl.getUniformLocation(prog, "uTopFade"),
      skyColor1: gl.getUniformLocation(prog, "skyColor1"),
      skyColor2: gl.getUniformLocation(prog, "skyColor2"),
      skyColorGradientPos: gl.getUniformLocation(prog, "skyColorGradientPos"),
    };

    let raf = 0;
    const t0 = performance.now();
    let alive = true;
    let signaled = false;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? 480;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const setUniforms = (cfg: CloudUniforms, time: number) => {
      gl.uniform2f(u.iResolution, canvas.width, canvas.height);
      gl.uniform1f(u.iTime, time);
      gl.uniform1f(u.initShiftX, cfg.initShiftX);
      gl.uniform1f(u.initShiftY, cfg.initShiftY);
      gl.uniform1f(u.cloudDensity, cfg.cloudDensity);
      gl.uniform1f(u.cloudSpeed, cfg.cloudSpeed);
      gl.uniform1f(u.cloudScale, cfg.cloudScale);
      gl.uniform1f(u.cloudDark, cfg.cloudDark);
      gl.uniform1f(u.cloudLight, cfg.cloudLight);
      gl.uniform1f(u.cloudCover, cfg.cloudCover);
      gl.uniform1f(u.cloudAlpha, cfg.cloudAlpha);
      gl.uniform1f(u.skyTint, cfg.skyTint);
      gl.uniform1i(u.cloudType, cfg.cloudType);
      gl.uniform1i(u.fdmCount, cfg.fdmCount);
      gl.uniform1i(u.rNoiseCount, cfg.rNoiseCount);
      gl.uniform1i(u.cNoiseCount, cfg.cNoiseCount);
      gl.uniform1f(u.uBottomFade, cfg.uBottomFade);
      gl.uniform1f(u.uTopFade, cfg.uTopFade);
      gl.uniform3fv(u.skyColor1, cfg.skyColor1);
      gl.uniform3fv(u.skyColor2, cfg.skyColor2);
      gl.uniform1f(u.skyColorGradientPos, cfg.skyColorGradientPos);
    };

    const tick = () => {
      if (!alive) return;
      const t = (performance.now() - t0) / 1000;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      setUniforms(uniforms, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!signaled) {
        signaled = true;
        // Let one painted frame land before revealing the hero
        requestAnimationFrame(() => onReadyRef.current?.());
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);

    // Safety: never block the UI forever if GL stalls
    const failSafe = window.setTimeout(() => {
      if (!signaled) {
        signaled = true;
        onReadyRef.current?.();
      }
    }, 1200);

    return () => {
      alive = false;
      window.clearTimeout(failSafe);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [condition, isDay, key]);

  const hidden = cloudUniformsForCondition(condition, isDay).hidden;
  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      className="ws-cloud-canvas"
      aria-hidden
    />
  );
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** GLSL ES port of APK `resource/code_3.json` (CLOUD_CANVAS). */
const FRAGMENT = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform float initShiftX;
uniform float initShiftY;
uniform float cloudDensity;
uniform float cloudSpeed;
uniform float cloudScale;
uniform float cloudDark;
uniform float cloudLight;
uniform float cloudCover;
uniform float cloudAlpha;
uniform float skyTint;
uniform int cloudType;
uniform int fdmCount;
uniform int rNoiseCount;
uniform int cNoiseCount;
uniform float uBottomFade;
uniform float uTopFade;
uniform vec3 skyColor1;
uniform vec3 skyColor2;
uniform float skyColorGradientPos;

const mat2 m1 = mat2(1.6, 1.2, -1.2, 1.6);
const mat2 m2 = mat2(1.8, 1.3, -1.3, 1.8);
const mat2 m3 = mat2(1.5, 1.1, -1.1, 1.5);

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash(i + 0.0)),
    dot(b, hash(i + o)),
    dot(c, hash(i + 1.0))
  );
  return dot(n, vec3(70.0));
}

float fbm(vec2 n, int type) {
  float total = 0.0;
  float amplitude = 0.1;
  mat2 chosenMat = m1;
  if (type == 1) chosenMat = m2;
  else if (type == 2) chosenMat = m3;
  else if (type == 3) chosenMat = mat2(3.2, 2.4, -2.4, 3.2);
  else if (type >= 4) chosenMat = mat2(9.0, 6.5, -6.5, 9.0);

  for (int i = 0; i < 7; i++) {
    if (i >= fdmCount) break;
    total += noise(n) * amplitude;
    n = chosenMat * n;
    amplitude *= 0.4;
  }
  return total;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 randShift = vec2(initShiftX, initShiftY) * iResolution.xy;
  vec2 p = (fragCoord.xy + randShift) / iResolution.xy;

  vec2 uv = p * vec2(iResolution.x / iResolution.y, 1.0);
  float time = iTime * cloudSpeed;

  float q = fbm(uv * cloudScale * 0.5, cloudType);

  float r = 0.0;
  uv *= cloudScale;
  uv -= q - time;
  float weight = 0.8;
  for (int i = 0; i < 8; i++) {
    if (i >= rNoiseCount) break;
    r += abs(weight * noise(uv));
    uv = m1 * uv + time;
    weight *= 0.7;
  }

  float f = 0.0;
  uv = p * vec2(iResolution.x / iResolution.y, 1.0);
  uv *= cloudScale;
  uv -= q - time;
  weight = 0.7;
  for (int i = 0; i < 8; i++) {
    if (i >= rNoiseCount) break;
    f += weight * noise(uv);
    uv = m2 * uv + time;
    weight *= 0.6;
  }

  f *= r + f;

  float c = 0.0;
  time = iTime * cloudSpeed * 2.0;
  uv = p * vec2(iResolution.x / iResolution.y, 1.0);
  uv *= cloudScale * 2.0;
  uv -= q - time;
  weight = 0.4;
  for (int i = 0; i < 7; i++) {
    if (i >= cNoiseCount) break;
    c += weight * noise(uv);
    uv = m3 * uv + time;
    weight *= 0.6;
  }

  float c1 = 0.0;
  time = iTime * cloudSpeed * 3.0;
  uv = p * vec2(iResolution.x / iResolution.y, 1.0);
  uv *= cloudScale * 3.0;
  uv -= q - time;
  weight = 0.4;
  for (int i = 0; i < 7; i++) {
    if (i >= cNoiseCount) break;
    c1 += abs(weight * noise(uv));
    uv = m1 * uv + time;
    weight *= 0.6;
  }

  c += c1;

  vec3 skycolour = mix(skyColor2, skyColor1, skyColorGradientPos);
  vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp(cloudDark + cloudLight * c, 0.0, 1.0);

  f = cloudCover + cloudAlpha * f * r * cloudDensity;
  float fade = smoothstep(0.8, 0.2, p.y);
  f *= fade;

  vec3 result = mix(skycolour, clamp(skyTint * skycolour + cloudcolour, 0.0, 1.0), clamp(f, 0.0, 1.0));

  float bottomFade = smoothstep(0.0, max(uTopFade, 0.001), p.y);
  float topFade = smoothstep(1.0, 1.0 - max(uBottomFade, 0.001), p.y);
  float fadeAlpha = bottomFade * topFade;

  gl_FragColor = vec4(result * fadeAlpha, fadeAlpha);
}
`;
