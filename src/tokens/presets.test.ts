import { describe, expect, it } from 'vitest';
import { getPairing } from './fontPairings';
import { deriveTokens } from './deriveTokens';
import { checkContrast } from './palette';
import { parseConfig } from './parseConfig';
import { STYLE_PRESETS } from './presets';

describe('style presets', () => {
  it('offers 4 to 6 examples with unique ids', () => {
    expect(STYLE_PRESETS.length).toBeGreaterThanOrEqual(4);
    expect(STYLE_PRESETS.length).toBeLessThanOrEqual(6);
    expect(new Set(STYLE_PRESETS.map((p) => p.id)).size).toBe(STYLE_PRESETS.length);
  });

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
