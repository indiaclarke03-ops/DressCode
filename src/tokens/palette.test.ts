import { describe, expect, it } from 'vitest';
import { contrastRatio, ensureContrast, isLight, normalizeHex, toLch } from './color';
import { generateDataPalette } from './dataPalette';
import { ACCENT_SWATCHES } from './defaults';
import { baseTheme, checkContrast, fixAccent, generatePalette, pickForeground } from './palette';
import { NEUTRALS, THEMES } from './types';

const AWKWARD_ACCENTS = ['#FFFF00', '#808080', '#FFFFFF', '#000000', '#00FF00', '#FF00FF', '#777777'];
const ACCENTS = [...ACCENT_SWATCHES.map((swatch) => swatch.hex), ...AWKWARD_ACCENTS];

const everyCombination = ACCENTS.flatMap((accent) =>
  NEUTRALS.flatMap((neutral) => THEMES.map((theme) => ({ accent, neutral, theme }))),
);

const ACCENT_PAIRS = ['accent-shape'];

describe('contrastRatio', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#C2552D', '#F7F5F0')).toBeCloseTo(4.16, 1);
  });
});

describe('normalizeHex', () => {
  it('accepts short, bare and lowercase forms', () => {
    expect(normalizeHex('#abc')).toBe('#AABBCC');
    expect(normalizeHex('1f5c45')).toBe('#1F5C45');
    expect(normalizeHex('  #1F5C45 ')).toBe('#1F5C45');
  });

  it('rejects anything else', () => {
    for (const bad of ['', '#12', '#12345', '#GGGGGG', 'red', 'url(x)', '#1234567']) {
      expect(normalizeHex(bad)).toBeNull();
    }
  });
});

describe('ensureContrast', () => {
  it('leaves passing colours untouched', () => {
    expect(ensureContrast('#1F5C45', ['#FFFFFF'], 4.5)).toBe('#1F5C45');
  });

  it('keeps the hue while fixing lightness', () => {
    const fixed = ensureContrast('#C2552D', ['#F7F5F0'], 4.5);
    expect(contrastRatio(fixed, '#F7F5F0')).toBeGreaterThanOrEqual(4.5);
    expect(toLch(fixed).h).toBeCloseTo(toLch('#C2552D').h, -1);
  });
});

describe('generatePalette', () => {
  it.each(everyCombination)('$accent $neutral $theme passes non-accent pairs', (combo) => {
    const palette = generatePalette(combo.accent, combo.neutral, combo.theme);
    const failing = checkContrast(palette).filter(
      (check) => !check.pass && !ACCENT_PAIRS.includes(check.id),
    );
    expect(failing.map((check) => check.label)).toEqual([]);
  });

  it.each(everyCombination)('$accent $neutral $theme is fully fixed by one click', (combo) => {
    const before = generatePalette(combo.accent, combo.neutral, combo.theme);
    const after = generatePalette(fixAccent(combo.accent, before), combo.neutral, combo.theme);
    expect(checkContrast(after).filter((check) => !check.pass)).toEqual([]);
  });

  it('puts status colours at AA on every surface', () => {
    for (const theme of THEMES) {
      const palette = generatePalette('#1F5C45', 'warm', theme);
      for (const colour of [palette.success, palette.warning, palette.danger]) {
        for (const surface of [palette.background, palette.surface, palette.surfaceRaised]) {
          expect(contrastRatio(colour, surface)).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it('tints neutrals by temperature', () => {
    const backgrounds = NEUTRALS.map((neutral) => generatePalette('#1F5C45', neutral, 'light').background);
    expect(new Set(backgrounds).size).toBe(3);
  });

  it('keeps bright fills, and reads as text through accent-text', () => {
    const palette = generatePalette('#F5C518', 'neutral', 'light');
    expect(palette.accent).toBe('#F5C518');
    expect(contrastRatio(palette.accentText, palette.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('colours the page itself in the tinted and vivid themes', () => {
    const pale = generatePalette('#E6287A', 'neutral', 'tinted').background;
    const deep = generatePalette('#E6287A', 'neutral', 'vivid').background;
    expect(toLch(pale).c).toBeGreaterThan(0.02);
    expect(toLch(deep).c).toBeGreaterThan(0.05);
    expect(pale).not.toBe(generatePalette('#0057E7', 'neutral', 'tinted').background);
  });

  it('keeps the chosen accent exactly as picked', () => {
    expect(generatePalette('#C2552D', 'warm', 'light').accent).toBe('#C2552D');
  });
});

describe('pickForeground', () => {
  it('uses white where it reads and dark ink where it does not', () => {
    expect(pickForeground('#1F5C45', '#111111')).toBe('#FFFFFF');
    expect(pickForeground('#FFFF00', '#111111')).toBe('#111111');
  });
});

describe('generateDataPalette', () => {
  const lightness = (hex: string) => toLch(hex).l;

  it.each(everyCombination)('$accent $neutral $theme stays readable', (combo) => {
    const palette = generatePalette(combo.accent, combo.neutral, combo.theme);
    const data = generateDataPalette(palette.accent, palette, baseTheme(combo.theme), 'expressive');
    expect(data.categorical).toHaveLength(8);
    expect(new Set(data.categorical).size).toBeGreaterThanOrEqual(5);
    for (const colour of data.categorical) {
      expect(contrastRatio(colour, palette.background)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(colour, palette.surface)).toBeGreaterThanOrEqual(3);
    }
  });

  it('gives mono-accent projects five series, led by the accent', () => {
    const palette = generatePalette('#1F5C45', 'warm', 'light');
    const data = generateDataPalette('#1F5C45', palette, 'light', 'mono-accent');
    expect(data.categorical).toHaveLength(5);
    expect(data.categorical[0]).toBe('#1F5C45');
  });

  it('uses greys only for black and white', () => {
    const palette = generatePalette('#E6287A', 'neutral', 'light');
    const data = generateDataPalette(palette.accent, palette, 'light', 'monochrome');
    expect(data.categorical.slice(0, 5).every((hex) => toLch(hex).c < 0.01)).toBe(true);
  });

  it('keeps duotone to two hues', () => {
    const palette = generatePalette('#0F6E6E', 'neutral', 'light');
    const { categorical } = generateDataPalette(palette.accent, palette, 'light', 'duotone');
    const hues = new Set(categorical.map((hex) => Math.round(toLch(hex).h / 20)));
    expect(hues.size).toBeLessThanOrEqual(3);
  });

  it.each(THEMES)('builds a sequential ramp that steps steadily in %s', (theme) => {
    const palette = generatePalette('#1F5C45', 'warm', theme);
    const { sequential } = generateDataPalette(palette.accent, palette, baseTheme(theme), 'mono-accent');
    expect(sequential).toHaveLength(5);
    const levels = sequential.map(lightness);
    const rising = (levels.at(-1) ?? 0) > (levels[0] ?? 0);
    for (let i = 1; i < levels.length; i += 1) {
      const step = (levels[i] ?? 0) - (levels[i - 1] ?? 0);
      expect(rising ? step : -step).toBeGreaterThan(0);
    }
  });

  it.each(THEMES)('builds a seven-step diverging scale faded at the middle in %s', (theme) => {
    const palette = generatePalette('#1F5C45', 'warm', theme);
    const { diverging } = generateDataPalette(palette.accent, palette, baseTheme(theme), 'mono-accent');
    expect(diverging).toHaveLength(7);
    const middle = diverging[3] ?? '';
    expect(toLch(middle).c).toBeLessThan(0.01);
    expect(isLight(middle)).toBe(baseTheme(theme) === 'light');
  });
});
