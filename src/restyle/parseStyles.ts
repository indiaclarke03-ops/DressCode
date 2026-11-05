import { cssColorToHex } from '@/tokens/color';
import type { ExtractedStyles } from '@/tokens/types';

const MAX_INPUT = 500_000;
const MAX_COLOURS = 24;
const MAX_OTHERS = 8;
const MAX_VALUE = 200;

const COLOUR = /#[0-9a-fA-F]{3,8}\b(?!\s*\{)|rgba?\([^()]*\)|hsla?\([^()]*\)/g;
/** shadcn/ui style: `--primary: 222.2 47.4% 11.2%;` */
const BARE_HSL = /--[\w-]+:\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/g;
const FONT_DECLARATION = /font-family\s*:\s*([^;}]+)|--font[\w-]*\s*:\s*([^;}]+)/g;
const RADIUS_DECLARATION = /border(?:-[a-z]+)*-radius\s*:\s*([^;}]+)|--radius[\w-]*\s*:\s*([^;}]+)/g;
const SHADOW_DECLARATION = /box-shadow\s*:\s*([^;}]+)|--shadow[\w-]*\s*:\s*([^;}]+)/g;

const GENERIC_FONTS = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif',
  'ui-serif', 'ui-monospace', 'ui-rounded', '-apple-system', 'blinkmacsystemfont', 'inherit',
  'initial', 'unset', 'segoe ui', 'roboto', 'helvetica neue', 'helvetica', 'arial', 'sans',
  'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji', 'menlo', 'monaco',
  'consolas', 'liberation mono', 'courier new',
]);
const NON_VALUES = new Set(['none', '0', '0px', 'inherit', 'initial', 'unset', '']);

const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '');

/** Most-used first: frequency is the best signal of what matters in a stylesheet. */
function byFrequency(values: string[], limit: number): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value]) => value);
}

function declarations(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].flatMap((match) => {
    const value = (match[1] ?? match[2] ?? '').trim();
    return value ? [value] : [];
  });
}

/** Values inside a Tailwind or JS theme block such as `borderRadius: { lg: '12px' }`. */
function themeBlock(text: string, key: string): string[][] {
  const blocks = text.matchAll(new RegExp(`\\b${key}\\s*:\\s*\\{([\\s\\S]*?)\\}`, 'g'));
  return [...blocks].flatMap((block) =>
    (block[1] ?? '').split('\n').flatMap((line) => {
      const strings = [...line.matchAll(/['"`]([^'"`]+)['"`]/g)].flatMap((m) => m[1] ?? []);
      return strings.length ? [strings] : [];
    }),
  );
}

function namedFont(stack: string): string | undefined {
  return stack
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .find((part) => part && !part.startsWith('var(') && !GENERIC_FONTS.has(part.toLowerCase()));
}

function parseColours(text: string): string[] {
  // A shadow's black is an effect, not part of the palette.
  const withoutShadows = text.replace(SHADOW_DECLARATION, '');
  const found = [
    ...[...withoutShadows.matchAll(COLOUR)].map((match) => match[0]),
    ...[...withoutShadows.matchAll(BARE_HSL)].map((m) => `hsl(${m[1]} ${m[2]}% ${m[3]}%)`),
  ];
  return byFrequency(found.flatMap((value) => cssColorToHex(value) ?? []), MAX_COLOURS);
}

function parseFonts(text: string): string[] {
  const css = declarations(text, FONT_DECLARATION).flatMap((stack) => namedFont(stack) ?? []);
  const theme = themeBlock(text, 'fontFamily').flatMap((stack) => namedFont(stack.join(',')) ?? []);
  return byFrequency([...css, ...theme], MAX_OTHERS);
}

function parseValues(text: string, pattern: RegExp, themeKey: string): string[] {
  const values = [...declarations(text, pattern), ...themeBlock(text, themeKey).flat()]
    .map((value) => value.replace(/\s*!important$/, '').trim())
    .filter((value) => !NON_VALUES.has(value) && !value.startsWith('var(') && value.length <= MAX_VALUE);
  return byFrequency(values, MAX_OTHERS);
}

/** Pulls colours, fonts, radii and shadows out of pasted CSS or a theme file. */
export function parseStyles(input: string): ExtractedStyles {
  const text = stripComments(input.slice(0, MAX_INPUT));
  return {
    colors: parseColours(text),
    fonts: parseFonts(text),
    radii: parseValues(text, RADIUS_DECLARATION, 'borderRadius'),
    shadows: parseValues(text, SHADOW_DECLARATION, 'boxShadow'),
  };
}

export function hasStyles(styles: ExtractedStyles): boolean {
  return Object.values(styles).some((values) => values.length > 0);
}
