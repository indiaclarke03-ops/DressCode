import { useCallback, useState } from 'react';
import type { DesignConfig } from '@/tokens/types';
import {
  createStyle,
  mergeImported,
  parseImport,
  readStyles,
  uniqueName,
  upsertStyle,
  writeStyles,
  type SavedStyle,
} from './styleLibrary';

export const STORAGE_ERROR =
  "Your browser wouldn't let us save here. It may be full, or in private mode. Download your style as a file instead.";

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useStyleLibrary() {
  const [styles, setStyles] = useState<SavedStyle[]>(() => {
    const storage = browserStorage();
    return storage ? readStyles(storage) : [];
  });
  const [error, setError] = useState('');

  const commit = useCallback((next: SavedStyle[]) => {
    const storage = browserStorage();
    const saved = storage !== null && writeStyles(storage, next);
    // Keep the list on screen either way, so the Export button can still rescue it.
    setStyles(next);
    setError(saved ? '' : STORAGE_ERROR);
    return saved;
  }, []);

  /** Re-reads first, so a style saved in another tab isn't overwritten. */
  const latest = useCallback(() => {
    const storage = browserStorage();
    const stored = storage ? readStyles(storage) : [];
    return stored.length ? stored : styles;
  }, [styles]);

  const save = useCallback(
    (name: string, config: DesignConfig, replacing?: SavedStyle) => {
      const current = latest();
      const finalName = replacing ? replacing.name : uniqueName(current, name);
      const style = createStyle(finalName, config, new Date(), replacing?.id ?? crypto.randomUUID());
      return commit(upsertStyle(current, style));
    },
    [commit, latest],
  );

  const remove = useCallback(
    (id: string) => commit(latest().filter((style) => style.id !== id)),
    [commit, latest],
  );

  /** Returns how many styles came in, or null for an unreadable file. */
  const importFile = useCallback(
    (text: string) => {
      const incoming = parseImport(text);
      if (!incoming) return null;
      commit(mergeImported(latest(), incoming));
      return incoming.length;
    },
    [commit, latest],
  );

  return { styles, error, save, remove, importFile };
}
