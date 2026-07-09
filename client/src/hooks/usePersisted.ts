import { useState } from "react";

/** Persist a string field to localStorage, keyed by `key`. */
export function usePersistedString(key: string, initial = "") {
  const [value, setValue] = useState(
    () => localStorage.getItem(key) ?? initial,
  );
  const set = (next: string) => {
    setValue(next);
    localStorage.setItem(key, next);
  };
  return [value, set] as const;
}

/** Persist a string-array field (e.g. selected permissions) to localStorage. */
export function usePersistedArray(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const set = (next: string[]) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, set] as const;
}
