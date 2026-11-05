import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { beforeYouFinishComment, styleTitle } from './shared';

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const family = (font: DesignTokens['fonts']['body']) => `'${font.family}', ${font.fallback}`;
const quoted = (text: string) => JSON.stringify(text);

function v3(tokens: DesignTokens): string {
  const { colors, fonts, type, radius, depth } = tokens;
  const colourLines = Object.entries(colors).map(
    ([role, value]) => `        ${quoted(kebab(role))}: '${value}',`,
  );
  const sizeLines = type.sizes.map((size, index) => `        'step-${index}': '${size}px',`);
  return [
    '// Tailwind v3: tailwind.config.js',
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
    ...colourLines,
    '      },',
    '      fontFamily: {',
    `        heading: [${quoted(family(fonts.heading))}],`,
    `        body: [${quoted(family(fonts.body))}],`,
    `        mono: [${quoted(family(fonts.mono))}],`,
    '      },',
    '      fontSize: {',
    ...sizeLines,
    '      },',
    '      borderRadius: {',
    `        control: '${radius.control}px',`,
    `        card: '${radius.card}px',`,
    '      },',
    '      boxShadow: {',
    `        card: ${quoted(depth.card)},`,
    `        raised: ${quoted(depth.raised)},`,
    '      },',
    '    },',
    '  },',
    '};',
  ].join('\n');
}

function v4(tokens: DesignTokens): string {
  const { colors, fonts, type, radius, depth } = tokens;
  return [
    '/* Tailwind v4: your main CSS file */',
    '@theme {',
    ...Object.entries(colors).map(([role, value]) => `  --color-${kebab(role)}: ${value};`),
    `  --font-heading: ${family(fonts.heading)};`,
    `  --font-body: ${family(fonts.body)};`,
    `  --font-mono: ${family(fonts.mono)};`,
    ...type.sizes.map((size, index) => `  --text-step-${index}: ${size}px;`),
    `  --radius-control: ${radius.control}px;`,
    `  --radius-card: ${radius.card}px;`,
    `  --shadow-card: ${depth.card};`,
    `  --shadow-raised: ${depth.raised};`,
    '}',
  ].join('\n');
}

export function tailwind(config: DesignConfig, tokens: DesignTokens): string {
  return [
    `/* ${styleTitle(config)} for Tailwind. Use the block that matches your version. */`,
    '',
    v3(tokens),
    '',
    v4(tokens),
    '',
    beforeYouFinishComment('/*', ' */', ' * '),
    '',
  ].join('\n');
}
