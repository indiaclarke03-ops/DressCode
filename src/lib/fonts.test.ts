import { describe, expect, it } from 'vitest';
import { FONT_PAIRINGS, getPairing } from '@/tokens/fontPairings';
import { googleFontsUrl } from './fonts';

describe('googleFontsUrl', () => {
  it('merges weights of a family used twice', () => {
    expect(googleFontsUrl(getPairing('geist'))).toBe(
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono:wght@400&display=swap',
    );
  });

  it('builds a url for every pairing', () => {
    for (const pairing of FONT_PAIRINGS) {
      expect(googleFontsUrl(pairing)).toContain('display=swap');
    }
  });
});
