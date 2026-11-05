import { toLch } from '@/tokens/color';

export const COLOR_ROLES = [
  'background', 'surface', 'surface-raised', 'border', 'text', 'text-muted',
  'accent', 'accent-foreground', 'success', 'warning', 'danger',
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];

const GREY_CHROMA = 0.04;
const VIVID_CHROMA = 0.08;
const STATUS_HUES: { role: ColorRole; from: number; to: number }[] = [
  { role: 'danger', from: 5, to: 40 },
  { role: 'warning', from: 60, to: 100 },
  { role: 'success', from: 125, to: 182 },
];

const nearbyStatus = (h: number) => STATUS_HUES.find(({ from, to }) => h >= from && h < to)?.role;

function byLightness(colours: string[]): { hex: string; l: number; c: number; h: number }[] {
  return colours.map((hex) => ({ hex, ...toLch(hex) })).sort((a, b) => b.l - a.l);
}

/**
 * Guesses what each old colour was for, by nearest role: darkest is text, lightest is
 * background, most saturated is accent. A dark UI swaps the first two, which shows up
 * as more dark neutrals than light ones.
 */
export function autoColorMap(colours: string[]): Record<string, string> {
  if (colours.length === 0) return {};
  const map: Record<string, ColorRole> = {};
  const assign = (hex: string, role: ColorRole) => {
    map[hex] ??= role;
  };

  const sorted = byLightness(colours);
  const lightest = sorted[0];
  const darkest = sorted.at(-1);
  if (!lightest || !darkest) return {};

  const neutrals = sorted.filter((colour) => colour.c < VIVID_CHROMA);
  const darkCount = neutrals.filter((colour) => colour.l < 0.4).length;
  const lightCount = neutrals.filter((colour) => colour.l > 0.75).length;
  const isDarkUi = darkCount > lightCount;
  if (lightest.c < VIVID_CHROMA) assign(lightest.hex, isDarkUi ? 'text' : 'background');
  if (darkest.hex !== lightest.hex && darkest.c < VIVID_CHROMA) {
    assign(darkest.hex, isDarkUi ? 'background' : 'text');
  }

  const vivid = sorted.filter((colour) => colour.c >= VIVID_CHROMA);
  const unmappedVivid = [...vivid].sort((a, b) => b.c - a.c);
  const accent = unmappedVivid.find((colour) => !nearbyStatus(colour.h)) ?? unmappedVivid[0];
  if (accent) assign(accent.hex, 'accent');

  for (const colour of vivid) {
    assign(colour.hex, nearbyStatus(colour.h) ?? 'accent');
  }

  const greys = sorted.filter((colour) => colour.c < VIVID_CHROMA && !map[colour.hex]);
  for (const colour of greys) {
    if (isDarkUi) {
      assign(colour.hex, colour.l < 0.4 ? 'surface' : colour.l < 0.75 ? 'text-muted' : 'text');
    } else if (colour.l > 0.94) {
      assign(colour.hex, 'surface');
    } else if (colour.l > 0.75) {
      assign(colour.hex, 'border');
    } else if (colour.l > 0.42) {
      assign(colour.hex, 'text-muted');
    } else {
      assign(colour.hex, 'text');
    }
  }

  // Tinted near-whites and near-blacks can land here; keep every colour mapped.
  for (const colour of sorted) {
    assign(colour.hex, colour.l > 0.5 ? 'surface' : colour.c < GREY_CHROMA ? 'text' : 'accent');
  }
  return map;
}
