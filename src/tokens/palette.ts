import { contrastRatio, ensureContrast, oklch, type Lch } from './color';
import type { DesignConfig } from './types';

export interface Palette {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentForeground: string;
  success: string;
  warning: string;
  danger: string;
}

type Neutral = DesignConfig['neutral'];
type Theme = DesignConfig['theme'];

const NEUTRAL_TINT: Record<Neutral, { c: number; h: number }> = {
  cool: { c: 0.012, h: 255 },
  warm: { c: 0.012, h: 85 },
  neutral: { c: 0, h: 0 },
};

type NeutralRole = 'background' | 'surface' | 'surfaceRaised' | 'border' | 'text' | 'textMuted';
type StatusRole = 'success' | 'warning' | 'danger';

/** Lightness of each neutral role, in OKLCH. */
const NEUTRAL_LIGHTNESS: Record<Theme, Record<NeutralRole, number>> = {
  light: {
    background: 0.975,
    surface: 0.995,
    surfaceRaised: 1,
    border: 0.9,
    text: 0.22,
    textMuted: 0.5,
  },
  dark: {
    background: 0.19,
    surface: 0.225,
    surfaceRaised: 0.26,
    border: 0.33,
    text: 0.94,
    textMuted: 0.74,
  },
};

const STATUS_COLOURS: Record<StatusRole, Lch> = {
  success: { l: 0.5, c: 0.12, h: 150 },
  warning: { l: 0.58, c: 0.13, h: 75 },
  danger: { l: 0.52, c: 0.17, h: 28 },
};

const AA_TEXT = 4.5;

/** White when it reads, then a tinted near-black, then pure black as the guarantee. */
export function pickForeground(accent: string, darkInk: string): string {
  for (const candidate of ['#FFFFFF', darkInk]) {
    if (contrastRatio(candidate, accent) >= AA_TEXT) return candidate;
  }
  return '#000000';
}

export function generatePalette(accent: string, neutral: Neutral, theme: Theme): Palette {
  const tint = NEUTRAL_TINT[neutral];
  const shade = (role: NeutralRole, chromaScale = 1) =>
    oklch({ l: NEUTRAL_LIGHTNESS[theme][role], c: tint.c * chromaScale, h: tint.h });

  const background = shade('background');
  const surface = shade('surface', 0.4);
  const surfaceRaised = shade('surfaceRaised', 0);
  const onBackgrounds = [background, surface, surfaceRaised];
  const status = (role: StatusRole) =>
    ensureContrast(oklch(STATUS_COLOURS[role]), onBackgrounds, AA_TEXT);

  return {
    background,
    surface,
    surfaceRaised,
    border: shade('border'),
    text: ensureContrast(shade('text'), onBackgrounds, AA_TEXT),
    textMuted: ensureContrast(shade('textMuted'), onBackgrounds, AA_TEXT),
    accent,
    accentForeground: pickForeground(accent, oklch({ l: 0.18, c: tint.c, h: tint.h })),
    success: status('success'),
    warning: status('warning'),
    danger: status('danger'),
  };
}

export interface ContrastCheck {
  id: string;
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  pass: boolean;
}

const CHECKED_PAIRS: { id: string; label: string; fg: keyof Palette; bg: keyof Palette }[] = [
  { id: 'text-background', label: 'Text on background', fg: 'text', bg: 'background' },
  { id: 'text-surface', label: 'Text on cards', fg: 'text', bg: 'surface' },
  { id: 'muted-background', label: 'Muted text on background', fg: 'textMuted', bg: 'background' },
  { id: 'muted-surface', label: 'Muted text on cards', fg: 'textMuted', bg: 'surface' },
  { id: 'button', label: 'Button label on accent', fg: 'accentForeground', bg: 'accent' },
  { id: 'accent-background', label: 'Accent text on background', fg: 'accent', bg: 'background' },
  { id: 'accent-surface', label: 'Accent text on cards', fg: 'accent', bg: 'surface' },
];

/** The live WCAG AA checklist for the Colour step. */
export function checkContrast(palette: Palette): ContrastCheck[] {
  return CHECKED_PAIRS.map(({ id, label, fg, bg }) => {
    const ratio = contrastRatio(palette[fg], palette[bg]);
    return {
      id,
      label,
      foreground: palette[fg],
      background: palette[bg],
      ratio,
      pass: ratio >= AA_TEXT,
    };
  });
}

/** The one-click fix: the nearest version of the accent that passes everywhere. */
export function fixAccent(accent: string, palette: Palette): string {
  return ensureContrast(accent, [palette.background, palette.surface], AA_TEXT);
}
