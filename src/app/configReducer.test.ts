import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '@/tokens/defaults';
import { getPairing } from '@/tokens/fontPairings';
import { checkContrast, generatePalette } from '@/tokens/palette';
import { configReducer } from './configReducer';

const base = createDefaultConfig('fresh', 'app');

describe('configReducer', () => {
  it('sets a choice without mutating the old state', () => {
    const snapshot = structuredClone(base);
    const next = configReducer(base, { type: 'set', patch: { theme: 'dark' } });
    expect(next.theme).toBe('dark');
    expect(base).toEqual(snapshot);
  });

  it('moves to a matching pairing when the heading style changes', () => {
    const next = configReducer(base, { type: 'set', patch: { headingStyle: 'serif' } });
    expect(getPairing(next.fontPairingId).style).toBe('serif');
  });

  it('keeps a pairing that already matches', () => {
    const next = configReducer(
      { ...base, fontPairingId: 'ibm-plex' },
      { type: 'set', patch: { density: 'compact' } },
    );
    expect(next.fontPairingId).toBe('ibm-plex');
  });

  it('resolves "No preference" to the project default', () => {
    const dashboard = createDefaultConfig('fresh', 'dashboard');
    const airy = configReducer(dashboard, { type: 'set', patch: { density: 'airy' } });
    expect(configReducer(airy, { type: 'noPreference', key: 'density' }).density).toBe('compact');
  });

  describe('changing project type', () => {
    it('moves defaults but keeps deliberate picks', () => {
      const picked = configReducer(base, { type: 'set', patch: { theme: 'dark' } });
      const next = configReducer(picked, { type: 'setProjectType', projectType: 'dashboard' });
      expect(next.density).toBe('compact');
      expect(next.theme).toBe('dark');
    });

    it('clears options that belonged to the old type', () => {
      const withOption = configReducer(base, {
        type: 'setProjectOption',
        key: 'nav',
        value: 'sidebar',
      });
      const next = configReducer(withOption, { type: 'setProjectType', projectType: 'map' });
      expect(next.projectOptions).toEqual({});
    });

    it('keeps the free text only for "Something else"', () => {
      const other = configReducer(base, {
        type: 'setProjectType',
        projectType: 'other',
        other: 'Allotment planner',
      });
      expect(other.projectTypeOther).toBe('Allotment planner');
      const next = configReducer(other, { type: 'setProjectType', projectType: 'docs' });
      expect(next.projectTypeOther).toBeUndefined();
    });
  });

  describe('accent', () => {
    it('normalises valid input and ignores invalid input', () => {
      expect(configReducer(base, { type: 'setAccent', accent: 'abc' }).accent).toBe('#AABBCC');
      expect(configReducer(base, { type: 'setAccent', accent: 'nope' })).toBe(base);
    });

    it('fixes contrast in one click', () => {
      const failing = { ...base, accent: '#E0C040' };
      const fixed = configReducer(failing, { type: 'fixContrast' });
      const palette = generatePalette(fixed.accent, fixed.neutral, fixed.theme);
      expect(checkContrast(palette).every((check) => check.pass)).toBe(true);
    });
  });

  describe('avoid list', () => {
    it('unchecks and rechecks items', () => {
      const off = configReducer(base, { type: 'toggleAvoid', item: 'gradients' });
      expect(off.avoid).not.toContain('gradients');
      expect(configReducer(off, { type: 'toggleAvoid', item: 'gradients' }).avoid).toContain(
        'gradients',
      );
    });

    it('adds custom items and ignores blanks', () => {
      const next = configReducer(base, { type: 'toggleAvoid', item: ' Skeuomorphism ' });
      expect(next.avoid).toContain('Skeuomorphism');
      expect(configReducer(base, { type: 'toggleAvoid', item: '   ' })).toBe(base);
    });
  });

  describe('restyle', () => {
    it('creates the restyle block when entering restyle mode', () => {
      expect(configReducer(base, { type: 'setMode', mode: 'restyle' }).restyle?.scope).toBe(
        'retheme',
      );
    });

    it('leaves state untouched when the mode is already set', () => {
      expect(configReducer(base, { type: 'setMode', mode: 'fresh' })).toBe(base);
    });

    it('never lets functionality be unlocked', () => {
      const next = configReducer(createDefaultConfig('restyle'), {
        type: 'setRestyle',
        patch: { keep: ['copy'] },
      });
      expect(next.restyle?.keep).toEqual(['copy', 'functionality']);
    });
  });

  it('resets to defaults but stays in the current mode', () => {
    const restyle = createDefaultConfig('restyle');
    const edited = configReducer(restyle, { type: 'set', patch: { name: 'Quiet Ledger' } });
    expect(configReducer(edited, { type: 'reset' })).toEqual(restyle);
  });
});
