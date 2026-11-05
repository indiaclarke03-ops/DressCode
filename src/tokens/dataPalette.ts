import { ensureContrast, oklch, toLch } from './color';
import type { Palette } from './palette';
import type { DesignConfig } from './types';

export interface DataPalette {
  categorical: string[];
  sequential: string[];
  diverging: string[];
}

/** Graphical objects need 3:1 against what they sit on (WCAG 1.4.11). */
const AA_GRAPHIC = 3;

/** Spaced for separation, not an even rainbow sweep; the first is the accent. */
const HUE_OFFSETS = [0, 150, 60, 215, 300, 95, 255, 30];
const SERIES_COUNT = { 'mono-accent': 5, expressive: 8 };
const SERIES_CHROMA = 0.1;
const SERIES_LIGHTNESS = { light: 0.52, dark: 0.74 };

/** The far end of a scale fades towards the background. */
const FADED_LIGHTNESS = { light: 0.93, dark: 0.32 };
const FADED_CHROMA_SCALE = 0.25;
const SEQUENTIAL_STEPS = 5;
const DIVERGING_ARM_STEPS = 3;
const DIVERGING_MIN_CHROMA = 0.08;

function ramp(from: string, to: string, steps: number): string[] {
  const start = toLch(from);
  const end = toLch(to);
  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1);
    return oklch({
      l: start.l + (end.l - start.l) * t,
      c: start.c + (end.c - start.c) * t,
      h: end.h,
    });
  });
}

export function generateDataPalette(
  accent: string,
  palette: Palette,
  theme: DesignConfig['theme'],
  strategy: DesignConfig['colorStrategy'],
): DataPalette {
  const backgrounds = [palette.background, palette.surface];
  const graphic = (hex: string) => ensureContrast(hex, backgrounds, AA_GRAPHIC);
  const anchor = graphic(accent);
  const { c, h } = toLch(anchor);

  const categorical = HUE_OFFSETS.slice(0, SERIES_COUNT[strategy]).map((offset, index) =>
    index === 0
      ? anchor
      : graphic(oklch({ l: SERIES_LIGHTNESS[theme], c: SERIES_CHROMA, h: h + offset })),
  );

  const faded = (hue: number, chroma: number) =>
    oklch({ l: FADED_LIGHTNESS[theme], c: chroma * FADED_CHROMA_SCALE, h: hue });

  const opposite = graphic(
    oklch({ l: toLch(anchor).l, c: Math.max(c, DIVERGING_MIN_CHROMA), h: h + 180 }),
  );
  const towardAccent = ramp(faded(h, c), anchor, DIVERGING_ARM_STEPS + 1);
  const towardOpposite = ramp(faded(h + 180, c), opposite, DIVERGING_ARM_STEPS + 1);

  return {
    categorical,
    sequential: ramp(faded(h, c), anchor, SEQUENTIAL_STEPS),
    diverging: [...towardOpposite.slice(1).reverse(), faded(h, 0), ...towardAccent.slice(1)],
  };
}

/** Spec A3: only some briefs need data palettes spelled out. */
export function needsDataPalette(config: DesignConfig): boolean {
  return (
    config.colorStrategy === 'expressive' ||
    ['dashboard', 'simulator', 'map'].includes(config.projectType)
  );
}
