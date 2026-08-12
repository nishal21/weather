import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  LOCALE_EXPLICIT_COOKIE,
  resolveLanguage,
  type LanguageCode,
} from "./locale";

export async function getServerLocale(): Promise<LanguageCode> {
  const jar = await cookies();
  const explicit = jar.get(LOCALE_EXPLICIT_COOKIE)?.value === "1";
  const pref = explicit ? (jar.get(LOCALE_COOKIE)?.value ?? null) : null;
  const h = await headers();
  const accept = h.get("accept-language");
  return resolveLanguage(pref, accept);
}
