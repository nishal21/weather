/** Re-exports — UI strings live in ui-source.ts (English) and translate online via MyMemory. */
export {
  LOCALE_AUTO,
  LOCALE_COOKIE,
  LOCALE_STORAGE,
  detectBrowserLanguage,
  parseAcceptLanguage,
  resolveLanguage,
  intlLocaleTag,
  openMeteoLanguage,
  bigDataCloudLanguage,
  languageDisplayName,
  languageNativeName,
  normalizeLanguageCode,
  isLocaleAuto,
  isKnownLanguage,
  parseAppLocale,
  type LanguageCode,
  type AppLocale,
} from "./locale";

export { LANGUAGE_CODES, type CatalogLanguageCode } from "./language-catalog";
export { UI_SOURCE, type UiKey } from "./ui-source";
export { sanitizeTranslation } from "./translate-sanitize";
export { translateOnline, translateMany } from "./translate-online";
