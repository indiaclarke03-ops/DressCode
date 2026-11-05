import { normalizeHex } from './color';
import { LOCKED_KEEP_ITEM } from './defaults';
import { findPairing } from './fontPairings';
import {
  COLOR_STRATEGIES,
  CONFIG_MODES,
  DENSITIES,
  DEPTHS,
  HEADING_STYLES,
  LAYOUTS,
  MOTIONS,
  NEUTRALS,
  PROJECT_TYPES,
  RADII,
  RESTYLE_SCOPES,
  THEMES,
  TYPE_SCALES,
  type DesignConfig,
  type ExtractedStyles,
  type RestyleConfig,
} from './types';

const MAX_TEXT = 500;
const MAX_LIST = 200;

type Raw = Record<string, unknown>;

const isRecord = (value: unknown): value is Raw =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.length <= MAX_TEXT;

const isOneOf = <T extends string>(options: readonly T[], value: unknown): value is T =>
  options.some((option) => option === value);

const isTextList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length <= MAX_LIST && value.every(isText);

const isOptionalText = (value: unknown): value is string | undefined =>
  value === undefined || isText(value);

function parseOptions(value: unknown): DesignConfig['projectOptions'] | null {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > MAX_LIST) return null;
  const valid = entries.every(
    ([key, option]) => isText(key) && (isText(option) || typeof option === 'boolean'),
  );
  // fromEntries defines own properties, so a "__proto__" key stays inert.
  return valid ? Object.fromEntries(entries as [string, string | boolean][]) : null;
}

function parseColorMap(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > MAX_LIST) return null;
  const valid = entries.every(([key, token]) => normalizeHex(key) !== null && isText(token));
  return valid ? Object.fromEntries(entries as [string, string][]) : null;
}

function parseExtracted(value: unknown): ExtractedStyles | null {
  if (!isRecord(value)) return null;
  const { colors, fonts, radii, shadows } = value;
  if (![colors, fonts, radii, shadows].every(isTextList)) return null;
  return {
    colors: colors as string[],
    fonts: fonts as string[],
    radii: radii as string[],
    shadows: shadows as string[],
  };
}

function parseRestyle(value: unknown): RestyleConfig | null {
  if (!isRecord(value)) return null;
  const { stylingSystem, extracted, keep, scope, gradualTarget, keepColor, colorMap } = value;
  if (!isText(stylingSystem) || !isOneOf(RESTYLE_SCOPES, scope)) return null;
  if (!isTextList(keep) || !keep.includes(LOCKED_KEEP_ITEM)) return null;
  if (!isOptionalText(gradualTarget) || !isOptionalText(keepColor)) return null;
  if (keepColor !== undefined && normalizeHex(keepColor) === null) return null;

  const parsedMap = parseColorMap(colorMap);
  if (!parsedMap) return null;
  const parsedExtracted = extracted === undefined ? undefined : parseExtracted(extracted);
  if (parsedExtracted === null) return null;

  return {
    stylingSystem,
    keep,
    scope,
    colorMap: parsedMap,
    ...(parsedExtracted ? { extracted: parsedExtracted } : {}),
    ...(gradualTarget !== undefined ? { gradualTarget } : {}),
    ...(keepColor !== undefined ? { keepColor } : {}),
  };
}

/** Validates untrusted input. All-or-nothing: a share link restores exactly, or not at all. */
export function parseConfig(raw: unknown): DesignConfig | null {
  if (!isRecord(raw) || raw.version !== 2) return null;
  const { mode, name, projectType, projectTypeOther, theme, density, radius, depth } = raw;
  const { colorStrategy, headingStyle, motion, layout, neutral, typeScale } = raw;
  const { fontPairingId, avoid } = raw;

  if (
    !isOneOf(CONFIG_MODES, mode) ||
    !isText(name) ||
    !isOneOf(PROJECT_TYPES, projectType) ||
    !isOptionalText(projectTypeOther) ||
    !isOneOf(THEMES, theme) ||
    !isOneOf(DENSITIES, density) ||
    !isOneOf(RADII, radius) ||
    !isOneOf(DEPTHS, depth) ||
    !isOneOf(COLOR_STRATEGIES, colorStrategy) ||
    !isOneOf(HEADING_STYLES, headingStyle) ||
    !isOneOf(MOTIONS, motion) ||
    !isOneOf(LAYOUTS, layout) ||
    !isOneOf(NEUTRALS, neutral) ||
    !isOneOf(TYPE_SCALES, typeScale) ||
    !isText(fontPairingId) ||
    !findPairing(fontPairingId) ||
    !isTextList(avoid)
  ) {
    return null;
  }

  const accent = typeof raw.accent === 'string' ? normalizeHex(raw.accent) : null;
  const projectOptions = parseOptions(raw.projectOptions);
  if (!accent || !projectOptions) return null;

  const restyle = raw.restyle === undefined ? undefined : parseRestyle(raw.restyle);
  if (restyle === null) return null;

  return {
    version: 2,
    mode,
    name,
    projectType,
    ...(projectTypeOther !== undefined ? { projectTypeOther } : {}),
    theme,
    density,
    radius,
    depth,
    colorStrategy,
    headingStyle,
    motion,
    layout,
    accent,
    neutral,
    fontPairingId,
    typeScale,
    projectOptions,
    avoid,
    ...(restyle ? { restyle } : {}),
  };
}
