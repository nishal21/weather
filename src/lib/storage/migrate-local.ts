/**
 * Copy legacy localStorage → new key once, then drop the old key.
 * Safe to call on every read; no-ops after migration.
 */
export function migrateLocalStorageKey(nextKey: string, legacyKey: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = localStorage.getItem(nextKey);
    if (next != null) {
      localStorage.removeItem(legacyKey);
      return;
    }
    const legacy = localStorage.getItem(legacyKey);
    if (legacy == null) return;
    localStorage.setItem(nextKey, legacy);
    localStorage.removeItem(legacyKey);
  } catch {
    /* ignore quota / private mode */
  }
}

export function getLocalStorageMigrating(
  nextKey: string,
  legacyKey: string,
): string | null {
  migrateLocalStorageKey(nextKey, legacyKey);
  try {
    return localStorage.getItem(nextKey);
  } catch {
    return null;
  }
}
