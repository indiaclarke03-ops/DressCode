import { parseConfig } from '@/tokens/parseConfig';
import type { DesignConfig } from '@/tokens/types';

export interface SavedStyle {
  id: string;
  name: string;
  savedAt: string;
  config: DesignConfig;
}

const STORAGE_KEY = 'dress-code-styles';
const EXPORT_APP = 'dress-code';
const EXPORT_VERSION = 1;
const MAX_NAME = 120;

export type StyleStorage = Pick<Storage, 'getItem' | 'setItem'>;

function parseStyle(raw: unknown): SavedStyle | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const { id, name, savedAt, config } = raw as Record<string, unknown>;
  const parsed = parseConfig(config);
  if (!parsed || typeof id !== 'string' || typeof name !== 'string') return null;
  if (typeof savedAt !== 'string' || !name.trim() || name.length > MAX_NAME) return null;
  return { id, name, savedAt, config: parsed };
}

const parseList = (raw: unknown): SavedStyle[] =>
  Array.isArray(raw) ? raw.flatMap((item) => parseStyle(item) ?? []) : [];

/** Anything unreadable is skipped, so one bad entry can't lose the rest. */
export function readStyles(storage: StyleStorage): SavedStyle[] {
  try {
    return parseList(JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]'));
  } catch {
    return [];
  }
}

/** False when storage is blocked or full. */
export function writeStyles(storage: StyleStorage, styles: SavedStyle[]): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(styles));
    return true;
  } catch {
    return false;
  }
}

export function createStyle(name: string, config: DesignConfig, now: Date, id: string): SavedStyle {
  return { id, name: name.trim(), savedAt: now.toISOString(), config: { ...config, name: name.trim() } };
}

export function findByName(styles: SavedStyle[], name: string): SavedStyle | undefined {
  const target = name.trim().toLowerCase();
  return styles.find((style) => style.name.toLowerCase() === target);
}

export function upsertStyle(styles: SavedStyle[], style: SavedStyle): SavedStyle[] {
  return styles.some((item) => item.id === style.id)
    ? styles.map((item) => (item.id === style.id ? style : item))
    : [style, ...styles];
}

/** "Acme brand" becomes "Acme brand 2" when both are kept. */
export function uniqueName(styles: SavedStyle[], name: string): string {
  let count = 2;
  let candidate = name.trim();
  while (findByName(styles, candidate)) {
    candidate = `${name.trim()} ${count}`;
    count += 1;
  }
  return candidate;
}

export function exportStyles(styles: SavedStyle[]): string {
  return JSON.stringify({ app: EXPORT_APP, version: EXPORT_VERSION, styles }, null, 2);
}

/** Returns the valid styles in a file, or null if it isn't a Dress Code export. */
export function parseImport(text: string): SavedStyle[] | null {
  try {
    const raw: unknown = JSON.parse(text);
    if (typeof raw !== 'object' || raw === null) return null;
    const { app, styles } = raw as Record<string, unknown>;
    if (app !== EXPORT_APP) return null;
    const parsed = parseList(styles);
    return parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

export function mergeImported(existing: SavedStyle[], incoming: SavedStyle[]): SavedStyle[] {
  return incoming.reduce((styles, style) => upsertStyle(styles, style), existing);
}
