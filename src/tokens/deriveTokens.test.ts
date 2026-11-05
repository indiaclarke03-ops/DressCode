import { describe, expect, it } from 'vitest';
import { configReducer } from '@/app/configReducer';
import { toCssVars } from './cssVars';
import { createDefaultConfig } from './defaults';
import { deriveTokens, typeSizes } from './deriveTokens';
import { PROJECT_TYPES, type Choices, type DesignConfig } from './types';

const vars = (config: DesignConfig) => toCssVars(deriveTokens(config));
const base = createDefaultConfig('fresh', 'dashboard');

const ROUNDS: { key: keyof Choices; a: string; b: string }[] = [
  { key: 'theme', a: 'light', b: 'dark' },
  { key: 'density', a: 'airy', b: 'compact' },
  { key: 'radius', a: 'sharp', b: 'soft' },
  { key: 'depth', a: 'flat', b: 'layered' },
  { key: 'colorStrategy', a: 'mono-accent', b: 'expressive' },
  { key: 'headingStyle', a: 'sans', b: 'serif' },
  { key: 'motion', a: 'quiet', b: 'expressive' },
  { key: 'layout', a: 'grid', b: 'editorial' },
];

describe('deriveTokens', () => {
  it('is deterministic', () => {
    expect(deriveTokens(base)).toEqual(deriveTokens(structuredClone(base)));
  });

  it.each(ROUNDS)('$key changes the CSS variables', ({ key, a, b }) => {
    const pick = (value: string) =>
      configReducer(base, { type: 'set', patch: { [key]: value } as Partial<Choices> });
    expect(vars(pick(a))).not.toEqual(vars(pick(b)));
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
  });

  it('uses no shadows when flat, and shadows when layered', () => {
    expect(deriveTokens({ ...base, depth: 'flat' }).depth.card).toBe('none');
    expect(deriveTokens({ ...base, depth: 'layered' }).depth.card).toContain('px');
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
