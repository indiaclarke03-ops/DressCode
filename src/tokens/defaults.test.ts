import { describe, expect, it } from 'vitest';
import { AVOID_ITEMS, ACCENT_SWATCHES, choicesFor, createDefaultConfig, KEEP_ITEMS } from './defaults';
import { FONT_PAIRINGS, defaultPairingId, findPairing, getPairing } from './fontPairings';
import { normalizeHex, toLch } from './color';

describe('defaults', () => {
  it('pre-checks the full avoid list', () => {
    expect(AVOID_ITEMS).toHaveLength(14);
    expect(createDefaultConfig().avoid).toHaveLength(14);
  });

  it('offers ten valid accents with no default purple or indigo', () => {
    expect(ACCENT_SWATCHES).toHaveLength(10);
    for (const { hex } of ACCENT_SWATCHES) {
      expect(normalizeHex(hex)).toBe(hex);
      const { h, c } = toLch(hex);
      const isPurple = h > 265 && h < 320 && c > 0.04;
      expect(isPurple).toBe(false);
    }
  });

  it('includes a restyle block only in restyle mode, with functionality locked', () => {
    expect(createDefaultConfig('fresh').restyle).toBeUndefined();
    expect(createDefaultConfig('restyle').restyle?.keep).toEqual(['functionality']);
    expect(KEEP_ITEMS.map((item) => item.id)).toContain('functionality');
  });

  it('tailors "No preference" to the project type', () => {
    expect(choicesFor('dashboard').density).toBe('compact');
    expect(choicesFor('editorial').headingStyle).toBe('serif');
    expect(choicesFor('game').theme).toBe('dark');
  });

  it('treats "Something else" like a web app', () => {
    expect(choicesFor('other')).toEqual(choicesFor('app'));
  });

  it('starts each project type on a pairing that matches its heading style', () => {
    const editorial = createDefaultConfig('fresh', 'editorial');
    expect(getPairing(editorial.fontPairingId).style).toBe('serif');
  });
});

describe('font pairings', () => {
  it('has 8-10 pairings with unique ids, covering both styles', () => {
    expect(FONT_PAIRINGS.length).toBeGreaterThanOrEqual(8);
    expect(FONT_PAIRINGS.length).toBeLessThanOrEqual(10);
    expect(new Set(FONT_PAIRINGS.map((pairing) => pairing.id)).size).toBe(FONT_PAIRINGS.length);
  });

  it('has a default pairing of the right style', () => {
    for (const style of ['sans', 'serif'] as const) {
      expect(findPairing(defaultPairingId(style))?.style).toBe(style);
    }
  });
});
