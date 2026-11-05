import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '@/tokens/defaults';
import type { DesignConfig } from '@/tokens/types';
import { decodeConfig, encodeConfig } from './urlState';

const encodeRaw = (value: unknown) =>
  btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

const fullRestyle: DesignConfig = {
  ...createDefaultConfig('restyle', 'other'),
  name: 'Quiet Ledger',
  projectTypeOther: 'Allotment planner',
  theme: 'dark',
  accent: '#C2552D',
  neutral: 'cool',
  fontPairingId: 'fraunces',
  headingStyle: 'serif',
  typeScale: 'dramatic',
  projectOptions: { nav: 'sidebar', uncertainty: true },
  avoid: ['gradients', 'Skeuomorphic buttons'],
  restyle: {
    stylingSystem: 'tailwind',
    extracted: {
      colors: ['#6C5CE7', '#F1F1F1'],
      fonts: ['Poppins'],
      radii: ['12px'],
      shadows: ['0 2px 4px #0003'],
    },
    keep: ['functionality', 'copy'],
    scope: 'gradual',
    gradualTarget: 'Settings page',
    colorMap: { '#6C5CE7': 'accent', '#F1F1F1': 'surface' },
  },
};

describe('share links', () => {
  it('restores a default config exactly', () => {
    const config = createDefaultConfig();
    expect(decodeConfig(encodeConfig(config))).toEqual(config);
  });

  it('restores a fully edited restyle config exactly', () => {
    expect(decodeConfig(encodeConfig(fullRestyle))).toEqual(fullRestyle);
  });

  it('survives non-ASCII names', () => {
    const config = { ...createDefaultConfig(), name: 'Café Ledger — 日本語 🎩' };
    expect(decodeConfig(encodeConfig(config))?.name).toBe(config.name);
  });

  it('only uses URL-safe characters', () => {
    expect(encodeConfig(fullRestyle)).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('hostile or broken links', () => {
  const valid = createDefaultConfig();

  it.each(['', 'not base64!!', '%%%', 'e30', encodeRaw(null), encodeRaw([]), encodeRaw('x')])(
    'rejects %j',
    (input) => {
      expect(decodeConfig(input)).toBeNull();
    },
  );

  it('rejects truncated links', () => {
    const encoded = encodeConfig(valid);
    expect(decodeConfig(encoded.slice(0, encoded.length - 12))).toBeNull();
  });

  it('rejects oversized input', () => {
    expect(decodeConfig('A'.repeat(32_001))).toBeNull();
  });

  it.each<[string, unknown]>([
    ['version', 1],
    ['theme', 'sepia'],
    ['density', 3],
    ['projectType', 'crypto'],
    ['accent', 'red; background: url(//evil)'],
    ['fontPairingId', 'comic-sans'],
    ['name', 'x'.repeat(501)],
    ['avoid', 'gradients'],
    ['avoid', Array.from({ length: 201 }, () => 'x')],
    ['projectOptions', { nav: { nested: true } }],
    ['projectOptions', []],
  ])('rejects a bad %s', (key, value) => {
    expect(decodeConfig(encodeRaw({ ...valid, [key]: value }))).toBeNull();
  });

  it('rejects a restyle that unlocks functionality', () => {
    const restyle = { ...createDefaultConfig('restyle').restyle, keep: ['copy'] };
    expect(decodeConfig(encodeRaw({ ...valid, restyle }))).toBeNull();
  });

  it('rejects a colour map with a non-hex key', () => {
    const restyle = { ...createDefaultConfig('restyle').restyle, colorMap: { oops: 'accent' } };
    expect(decodeConfig(encodeRaw({ ...valid, restyle }))).toBeNull();
  });

  it('drops unknown fields', () => {
    const decoded = decodeConfig(encodeRaw({ ...valid, isAdmin: true }));
    expect(decoded).toEqual(valid);
  });

  it('does not pollute prototypes through option keys', () => {
    const json = JSON.stringify(valid).replace(
      '"projectOptions":{}',
      '"projectOptions":{"__proto__":{"polluted":"yes"}}',
    );
    decodeConfig(btoa(json).replace(/=+$/, ''));
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();

    const scalar = JSON.stringify(valid).replace(
      '"projectOptions":{}',
      '"projectOptions":{"__proto__":"yes"}',
    );
    const decoded = decodeConfig(btoa(scalar).replace(/=+$/, ''));
    expect(Object.getPrototypeOf(decoded?.projectOptions)).toBe(Object.prototype);
  });
});
