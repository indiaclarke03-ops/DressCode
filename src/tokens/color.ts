import {
  clampChroma,
  converter,
  formatHex,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeRgb,
  parse,
  useMode,
  wcagContrast,
  type Oklch,
} from 'culori/fn';

// Register only what we use, so the landing page doesn't pay for all of culori.
useMode(modeRgb);
useMode(modeLrgb);
useMode(modeOklab);
useMode(modeOklch);

const toOklch = converter('oklch');

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Returns uppercase #RRGGBB, or null when the input isn't a hex colour. */
export function normalizeHex(input: string): string | null {
  const match = HEX_PATTERN.exec(input.trim());
  if (!match?.[1]) return null;
  const digits = match[1];
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  return `#${full.toUpperCase()}`;
}

export interface Lch {
  l: number;
  c: number;
  h: number;
}

/** OKLCH to hex, pulled back into the sRGB gamut without moving lightness or hue. */
export function oklch({ l, c, h }: Lch): string {
  const color: Oklch = { mode: 'oklch', l, c, h };
  return (formatHex(clampChroma(color, 'oklch')) ?? '#000000').toUpperCase();
}

export function toLch(hex: string): Lch {
  const color = toOklch(parse(hex));
  if (!color) throw new Error(`Not a colour: ${hex}`);
  return { l: color.l, c: color.c ?? 0, h: color.h ?? 0 };
}

export function contrastRatio(a: string, b: string): number {
  return wcagContrast(a, b);
}

/** WCAG relative brightness check: is this a light background? */
export function isLight(hex: string): boolean {
  return contrastRatio(hex, '#000000') > contrastRatio(hex, '#FFFFFF');
}

const LIGHTNESS_STEP = 0.005;

/**
 * Moves a colour's lightness away from the backgrounds until it clears `min`
 * against all of them. Hue and chroma are kept, so it stays recognisably the
 * same colour. A colour that already passes comes back unchanged.
 */
export function ensureContrast(hex: string, backgrounds: string[], min: number): string {
  const passes = (candidate: string) =>
    backgrounds.every((background) => contrastRatio(candidate, background) >= min);
  if (passes(hex)) return hex;

  const { l, c, h } = toLch(hex);
  const direction = backgrounds.every(isLight) ? -1 : 1;
  for (let next = l; next >= 0 && next <= 1; next += direction * LIGHTNESS_STEP) {
    const candidate = oklch({ l: next, c, h });
    if (passes(candidate)) return candidate;
  }
  return direction < 0 ? '#000000' : '#FFFFFF';
}
