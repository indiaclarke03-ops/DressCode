import { describe, expect, it } from 'vitest';
import { configReducer } from '@/app/configReducer';
import { ROUNDS } from '@/flows/shared/rounds';
import { toCssVars } from './cssVars';
import { createDefaultConfig } from './defaults';
import { deriveTokens, typeSizes } from './deriveTokens';
import { PROJECT_TYPES, type Choices, type DesignConfig } from './types';

const vars = (config: DesignConfig) => toCssVars(deriveTokens(config));
const base = createDefaultConfig('fresh', 'dashboard');

describe('deriveTokens', () => {
  it('is deterministic', () => {
    expect(deriveTokens(base)).toEqual(deriveTokens(structuredClone(base)));
  });

  it.each(ROUNDS)('every option of "$key" gives a different result', ({ key, options }) => {
    const results = options.map(({ value }) =>
      JSON.stringify(vars(configReducer(base, { type: 'set', patch: { [key]: value } as Partial<Choices> }))),
    );
    expect(new Set(results).size).toBe(options.length);
  });

  it('has eleven rounds, most with three or four options', () => {
    expect(ROUNDS).toHaveLength(11);
    expect(ROUNDS.filter((round) => round.options.length >= 3).length).toBeGreaterThanOrEqual(10);
  });

  it('responds to accent, neutral, pairing and type scale', () => {
    const baseline = vars(base);
    const edits: Partial<DesignConfig>[] = [
      { accent: '#7A2230' },
      { neutral: 'cool' },
      { fontPairingId: 'ibm-plex' },
      { typeScale: 'dramatic' },
    ];
    for (const edit of edits) expect(vars({ ...base, ...edit })).not.toEqual(baseline);
  });

  it('maps radius to the ranges in the spec', () => {
    expect(deriveTokens({ ...base, radius: 'sharp' }).radius).toEqual({ control: 2, card: 4 });
    expect(deriveTokens({ ...base, radius: 'soft' }).radius).toEqual({ control: 12, card: 16 });
    expect(deriveTokens({ ...base, radius: 'none' }).radius).toEqual({ control: 0, card: 0 });
  });

  it('uses no shadows when flat, and shadows when layered', () => {
    expect(deriveTokens({ ...base, depth: 'flat' }).depth.card).toBe('none');
    expect(deriveTokens({ ...base, depth: 'layered' }).depth.card).toContain('px');
    expect(deriveTokens({ ...base, depth: 'borderless' }).depth.card).toBe('none');
  });

  it('gives bold depth thick borders and a hard shadow in the text colour', () => {
    const tokens = deriveTokens({ ...base, depth: 'bold' });
    expect(tokens.depth.borderWidth).toBe(2);
    expect(tokens.depth.card).toContain(tokens.colors.text);
  });

  it('replaces the accent with ink for black and white', () => {
    const tokens = deriveTokens({ ...base, colorStrategy: 'monochrome' });
    expect(tokens.colors.accent).toBe(tokens.colors.text);
  });

  it('fills bands with the accent only for colour blocks', () => {
    const plain = deriveTokens(base);
    expect(plain.band.background).toBe(plain.colors.surface);
    const blocks = deriveTokens({ ...base, colorUse: 'blocks' });
    expect(blocks.band.background).toBe(blocks.colors.accent);
    expect(blocks.band.text).toBe(blocks.colors.accentForeground);
  });

  it('spells out data palettes where the spec asks for them', () => {
    const include = (projectType: DesignConfig['projectType'], expressive = false) =>
      deriveTokens({
        ...createDefaultConfig('fresh', projectType),
        colorStrategy: expressive ? 'expressive' : 'mono-accent',
      }).includeDataPalette;
    expect(include('dashboard')).toBe(true);
    expect(include('simulator')).toBe(true);
    expect(include('map')).toBe(true);
    expect(include('docs')).toBe(false);
    expect(include('docs', true)).toBe(true);
  });

  it.each(PROJECT_TYPES)('produces complete variables for %s', (projectType) => {
    const css = vars(createDefaultConfig('fresh', projectType));
    expect(css['--bb-color-accent']).toMatch(/^#[0-9A-F]{6}$/);
    expect(css['--bb-color-surface-raised']).toMatch(/^#[0-9A-F]{6}$/);
    expect(css['--bb-font-heading']).toContain("'");
    for (const value of Object.values(css)) {
      expect(value).not.toMatch(/undefined|NaN/);
      expect(value).not.toBe('');
    }
  });
});

describe('typeSizes', () => {
  it.each([
    [14, 1.125],
    [14, 1.2],
    [14, 1.333],
    [16, 1.125],
    [16, 1.2],
    [16, 1.333],
  ])('rises strictly and stays legible from %ipx at %d', (size, ratio) => {
    const sizes = typeSizes(size, ratio);
    expect(sizes).toHaveLength(7);
    expect(sizes[1]).toBe(size);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(12);
    expect([...sizes].sort((a, b) => a - b)).toEqual(sizes);
    expect(new Set(sizes).size).toBe(7);
  });
});
