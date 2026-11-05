import { describe, expect, it } from 'vitest';
import { configReducer } from '@/app/configReducer';
import { contrastRatio } from './color';
import { createDefaultConfig, choicesFor } from './defaults';
import { deriveTokens } from './deriveTokens';
import { STYLE_DIRECTIONS } from './directions';
import { getPairing } from './fontPairings';
import { checkContrast } from './palette';
import { parseConfig } from './parseConfig';
import { STYLE_PRESETS } from './presets';

const CHOICE_KEYS = Object.keys(STYLE_DIRECTIONS[0]?.choices ?? {}) as (keyof typeof STYLE_DIRECTIONS[0]['choices'])[];

describe('style directions', () => {
  it('offers twelve looks with unique ids and accents', () => {
    expect(STYLE_DIRECTIONS).toHaveLength(12);
    expect(new Set(STYLE_DIRECTIONS.map((d) => d.id)).size).toBe(12);
    expect(new Set(STYLE_DIRECTIONS.map((d) => d.accent)).size).toBe(12);
  });

  it('keeps every look at least four choices away from every other', () => {
    for (const a of STYLE_DIRECTIONS) {
      for (const b of STYLE_DIRECTIONS) {
        if (a === b) continue;
        const differences = CHOICE_KEYS.filter((key) => a.choices[key] !== b.choices[key]).length;
        expect(differences, `${a.name} v ${b.name}`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('actually uses the full range of each choice', () => {
    for (const key of CHOICE_KEYS) {
      const used = new Set(STYLE_DIRECTIONS.map((direction) => direction.choices[key]));
      expect(used.size, key).toBeGreaterThanOrEqual(2);
    }
    const themes = new Set(STYLE_DIRECTIONS.map((d) => d.choices.theme));
    expect(themes.size).toBe(4);
  });

  it('gives each look a different page background and heading font', () => {
    const tokens = STYLE_PRESETS.map((preset) => deriveTokens(preset.config));
    expect(new Set(tokens.map((t) => t.colors.background)).size).toBeGreaterThanOrEqual(10);
    expect(new Set(tokens.map((t) => t.fonts.heading.family)).size).toBe(12);
  });

  it('spans pale to deep pages', () => {
    const contrasts = STYLE_PRESETS.map((preset) =>
      contrastRatio(deriveTokens(preset.config).colors.background, '#FFFFFF'),
    );
    expect(Math.min(...contrasts)).toBeLessThan(1.2);
    expect(Math.max(...contrasts)).toBeGreaterThan(8);
  });
});

describe('style presets', () => {
  it.each(STYLE_PRESETS)('$name is a valid config', ({ config }) => {
    expect(parseConfig(config)).toEqual(config);
  });

  it.each(STYLE_PRESETS)('$name passes every contrast check', ({ config }) => {
    const failing = checkContrast(deriveTokens(config).colors).filter((check) => !check.pass);
    expect(failing.map((check) => check.label)).toEqual([]);
  });

  it.each(STYLE_PRESETS)('$name has a pairing matching its heading style', ({ config }) => {
    expect(getPairing(config.fontPairingId).style).toBe(config.headingStyle);
  });
});

describe('picking a look', () => {
  const base = createDefaultConfig('fresh', 'dashboard');
  const riot = configReducer(base, { type: 'setDirection', id: 'pop-riot' });

  it('sets every choice, colour and font, and keeps the project type', () => {
    expect(riot.depth).toBe('bold');
    expect(riot.accent).toBe('#E6287A');
    expect(riot.fontPairingId).toBe('archivo');
    expect(riot.projectType).toBe('dashboard');
  });

  it('makes "No preference" mean the look, not the project default', () => {
    const changed = configReducer(riot, { type: 'set', patch: { depth: 'flat' } });
    expect(configReducer(changed, { type: 'noPreference', key: 'depth' }).depth).toBe('bold');
  });

  it('survives a change of project type', () => {
    const next = configReducer(riot, { type: 'setProjectType', projectType: 'docs' });
    expect(next.depth).toBe('bold');
    expect(next.texture).toBe('dots');
  });

  it('returns to a plain base with "Start from the basics"', () => {
    const next = configReducer(riot, { type: 'setDirection', id: '' });
    expect(next.direction).toBe('');
    expect(next.depth).toBe(choicesFor('dashboard').depth);
    expect(next.texture).toBe('none');
    expect(getPairing(next.fontPairingId).style).toBe(next.headingStyle);
  });
});
