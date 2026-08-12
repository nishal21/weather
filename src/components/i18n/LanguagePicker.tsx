"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  DeviceMobile,
  GlobeHemisphereWest,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { LANGUAGE_CODES } from "@/lib/i18n/language-catalog";
import {
  LOCALE_AUTO,
  languageDisplayName,
  languageNativeName,
  normalizeLanguageCode,
} from "@/lib/i18n/locale";

type RowProps = {
  primary: string;
  secondary?: string;
  selected?: boolean;
  icon?: "device" | "globe";
  onSelect: () => void;
};

function PickerRow({
  primary,
  secondary,
  selected,
  icon = "globe",
  onSelect,
}: RowProps) {
  const Icon = icon === "device" ? DeviceMobile : GlobeHemisphereWest;
  return (
    <button
      type="button"
      className="search-modal-row group flex min-h-[3.25rem] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
      onClick={onSelect}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sky-300/90 group-hover:border-sky-400/20 group-hover:bg-sky-400/10">
        <Icon className="size-4" weight="fill" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-white">
          {primary}
        </span>
        {secondary ? (
          <span className="mt-0.5 block truncate text-[13px] text-white/45">
            {secondary}
          </span>
        ) : null}
      </span>
      {selected ? (
        <Check className="size-4 shrink-0 text-sky-300" weight="bold" aria-hidden />
      ) : (
        <span className="size-4 shrink-0" aria-hidden />
      )}
    </button>
  );
}

/** Compact row at the bottom of search — opens the full picker. */
export function LanguagePickerRow({ onOpen }: { onOpen: () => void }) {
  const { locale, preference, preferenceLabel } = useLocale();
  const t = useT();

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
      onClick={onOpen}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/60">
        <GlobeHemisphereWest className="size-4" weight="fill" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-white/45">{t("lang.label")}</span>
        <span className="mt-0.5 block truncate text-[15px] font-medium text-white">
          {preferenceLabel}
        </span>
      </span>
      <span className="shrink-0 text-[13px] text-white/35" aria-hidden>
        ›
      </span>
      <span className="sr-only">
        {t("lang.choose")} — {languageDisplayName(locale, "en")}
      </span>
    </button>
  );
}

type PanelProps = {
  onBack: () => void;
  onClose?: () => void;
};

/** Full-screen drill-in inside the search modal. */
export function LanguagePickerPanel({ onBack, onClose }: PanelProps) {
  const { locale, preference, setLocale } = useLocale();
  const t = useT();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const languages = useMemo(() => {
    const rows = LANGUAGE_CODES.map((code) => ({
      code,
      native: languageNativeName(code),
      english: languageDisplayName(code, "en"),
    }));
    if (!deferred) return rows;
    return rows.filter(
      (row) =>
        row.code.includes(deferred) ||
        row.native.toLowerCase().includes(deferred) ||
        row.english.toLowerCase().includes(deferred),
    );
  }, [deferred]);

  const pick = (code: string) => {
    setLocale(code);
    onBack();
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-3">
        <button
          type="button"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label={t("lang.back")}
          onClick={onBack}
        >
          <ArrowLeft className="size-4" weight="bold" />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white">
          {t("lang.choose")}
        </h2>
        {onClose ? (
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label={t("search.close")}
            onClick={onClose}
          >
            <X className="size-4" weight="bold" />
          </button>
        ) : null}
      </div>

      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <MagnifyingGlass
            className="size-4 shrink-0 text-white/40"
            weight="bold"
            aria-hidden
          />
          <input
            type="search"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
            placeholder={t("lang.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      <div className="search-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PickerRow
          icon="device"
          primary={t("lang.device")}
          secondary={t("lang.deviceHint")}
          selected={preference === LOCALE_AUTO}
          onSelect={() => pick(LOCALE_AUTO)}
        />

        {languages.length === 0 ? (
          <p className="px-4 py-6 text-center text-[13px] text-white/45">
            {t("lang.noResults")}
          </p>
        ) : (
          <ul className="mt-1 divide-y divide-white/[0.05]">
            {languages.map((row) => (
              <li key={row.code}>
                <PickerRow
                  primary={row.native}
                  secondary={
                    row.english !== row.native ? row.english : undefined
                  }
                  selected={
                    preference !== LOCALE_AUTO &&
                    normalizeLanguageCode(preference) === row.code
                  }
                  onSelect={() => pick(row.code)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
