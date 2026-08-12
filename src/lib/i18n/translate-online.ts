import { normalizeLanguageCode } from "./locale";

/** In-process cache — MyMemory responses are cached for the server lifetime. */
const cache = new Map<string, string>();

const MYMEMORY_WARNING = /MYMEMORY WARNING/i;
const TRAILING_NAME = /Name\s*$/i;
const MOJIBAKE = /(?:à[\u0080-\u00bf]|Ã[\u0080-\u00bf]|â[\u0080-\u00bf])/;
const GARBAGE_TAIL = /weather condition/i;

function tryFixMojibake(text: string): string | null {
  try {
    const bytes = Uint8Array.from(text, (c) => c.charCodeAt(0) & 0xff);
    const fixed = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return fixed.replace(TRAILING_NAME, "").trim() || null;
  } catch {
    return null;
  }
}

function maxTranslatedLength(source: string): number {
  if (source.length <= 16) return Math.max(36, source.length * 2);
  if (source.length <= 40) return Math.max(64, source.length * 2);
  return Math.max(120, source.length * 2);
}

function hasTargetScript(text: string, lang: string): boolean {
  if (lang === "ml") return /[\u0d00-\u0d7f]/.test(text);
  if (lang === "hi") return /[\u0900-\u097f]/.test(text);
  if (lang === "ta") return /[\u0b80-\u0bff]/.test(text);
  if (lang === "te") return /[\u0c00-\u0c7f]/.test(text);
  if (lang === "kn") return /[\u0c80-\u0cff]/.test(text);
  if (lang === "bn") return /[\u0980-\u09ff]/.test(text);
  return true;
}

/** Reject or repair bad MyMemory output before it hits the UI. */
export function sanitizeTranslation(
  source: string,
  translated: string | undefined | null,
  target: string,
): string {
  const lang = normalizeLanguageCode(target);
  if (lang === "en") return source;
  if (!translated?.trim()) return source;

  let out = translated.trim();

  if (MYMEMORY_WARNING.test(out)) return source;

  if (MOJIBAKE.test(out)) {
    const fixed = tryFixMojibake(out);
    if (fixed && isPlausibleTranslation(source, fixed, lang)) {
      out = fixed;
    } else {
      return source;
    }
  }

  out = out.replace(TRAILING_NAME, "").trim();
  if (GARBAGE_TAIL.test(out)) return source;

  if (!isPlausibleTranslation(source, out, lang)) return source;

  return out;
}

function isPlausibleTranslation(
  source: string,
  translated: string,
  lang: string,
): boolean {
  if (!translated) return false;
  if (MYMEMORY_WARNING.test(translated)) return false;
  if (MOJIBAKE.test(translated)) return false;
  if (TRAILING_NAME.test(translated) && !TRAILING_NAME.test(source)) {
    return false;
  }

  if (translated.length > maxTranslatedLength(source)) return false;

  const latinWords = translated
    .replace(/[\u0900-\u097f\u0b80-\u0bff\u0c00-\u0c7f\u0c80-\u0cff\u0d00-\u0d7f0-9\s·.,!?°%:;()/-]/g, "")
    .trim();

  if (lang !== "en" && source.length <= 40) {
    const unchanged =
      translated.toLowerCase() === source.toLowerCase() ||
      latinWords.toLowerCase() === source.replace(/[^A-Za-z ]/g, "").toLowerCase();
    if (unchanged && !hasTargetScript(translated, lang)) return false;
  }

  if (lang === "ml" || lang === "hi" || lang === "ta" || lang === "te" || lang === "kn" || lang === "bn") {
    if (hasTargetScript(translated, lang)) {
      if (latinWords.length > 6) return false;
      return true;
    }
    if (/[A-Za-z]{6,}/.test(translated)) return false;
  }

  return true;
}

function scoreCandidate(
  source: string,
  candidate: string | undefined,
  lang: string,
): number {
  if (!candidate?.trim()) return -1;
  const out = sanitizeTranslation(source, candidate, lang);
  if (out === source) return 0;
  let score = 10;
  if (hasTargetScript(out, lang)) score += 20;
  if (out.length <= maxTranslatedLength(source)) score += 5;
  return score;
}

/**
 * Free translation via MyMemory (https://mymemory.translated.net).
 * Supports any ISO 639-1 target via langpair=en|XX.
 */
export async function translateOnline(
  text: string,
  target: string,
): Promise<string> {
  const trimmed = text.trim();
  const lang = normalizeLanguageCode(target);
  if (!trimmed || lang === "en") return text;

  const cacheKey = `${lang}::${trimmed}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|${lang}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });
    if (!res.ok) return text;
    const data = (await res.json()) as {
      responseData?: { translatedText?: string };
      matches?: { translation?: string; quality?: number | string }[];
    };

    const candidates = [
      data.responseData?.translatedText,
      ...(data.matches ?? []).map((m) => m.translation),
    ].filter(Boolean) as string[];

    let best = text;
    let bestScore = 0;
    for (const cand of candidates) {
      const score = scoreCandidate(trimmed, cand, lang);
      if (score > bestScore) {
        bestScore = score;
        best = sanitizeTranslation(trimmed, cand, lang);
      }
    }

    cache.set(cacheKey, best);
    return best;
  } catch {
    return text;
  }
}

export async function translateMany(
  texts: string[],
  target: string,
): Promise<string[]> {
  const lang = normalizeLanguageCode(target);
  if (lang === "en") return texts;
  const unique = [...new Set(texts.filter(Boolean))];
  await Promise.all(unique.map((t) => translateOnline(t, lang)));
  return texts.map((t) => cache.get(`${lang}::${t.trim()}`) ?? t);
}
