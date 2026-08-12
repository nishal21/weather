import "server-only";

import { normalizeLanguageCode } from "./locale";
import { sanitizeTranslation, scoreTranslationCandidate } from "./translate-sanitize";
import { serverEnv } from "@/lib/env/server";

/** In-process cache — MyMemory responses are cached for the server lifetime. */
const cache = new Map<string, string>();

/**
 * Free translation via MyMemory (https://mymemory.translated.net).
 * Supports any ISO 639-1 target via langpair=en|XX.
 * Server-only — never import from client components.
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

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("langpair", `en|${lang}`);
  if (serverEnv.myMemoryContactEmail) {
    url.searchParams.set("de", serverEnv.myMemoryContactEmail);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
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
      const score = scoreTranslationCandidate(trimmed, cand, lang);
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
