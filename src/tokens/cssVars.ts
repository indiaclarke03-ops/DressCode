import type { DesignTokens } from './deriveTokens';
import type { FontRole } from './fontPairings';

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const px = (value: number) => `${value}px`;
const stack = (font: FontRole) => `'${font.family}', ${font.fallback}`;

function numbered(prefix: string, values: (string | number)[]): [string, string][] {
  return values.map((value, index) => [`--bb-${prefix}-${index + 1}`, String(value)]);
}

/** Flat `--bb-*` variables for the preview frame and tokens.css. */
export function toCssVars(tokens: DesignTokens): Record<string, string> {
  const { colors, data, emphasis, band, fonts, type, spacing, radius, depth, motion, layout, heading, texture } = tokens;
  return Object.fromEntries([
    ...Object.entries(colors).map(([role, value]) => [`--bb-color-${kebab(role)}`, value]),
    ...numbered('emphasis', emphasis),
    ...numbered('data', data.categorical),
    ...numbered('sequential', data.sequential),
    ...numbered('diverging', data.diverging),
    ['--bb-font-heading', stack(fonts.heading)],
    ['--bb-font-body', stack(fonts.body)],
    ['--bb-font-mono', stack(fonts.mono)],
    ['--bb-font-weight-heading', String(fonts.heading.weight)],
    ['--bb-font-weight-body', String(fonts.body.weight)],
    ['--bb-line-height', String(type.lineHeight)],
    ...numbered('text', type.sizes.map(px)),
    ...numbered('space', spacing.map(px)),
    ['--bb-radius-control', px(radius.control)],
    ['--bb-radius-card', px(radius.card)],
    ['--bb-band-background', band.background],
    ['--bb-band-text', band.text],
    ['--bb-band-muted', band.muted],
    ['--bb-band-accent', band.accent],
    ['--bb-band-accent-text', band.accentText],
    ['--bb-band-on-accent', band.onAccent],
    ['--bb-band-emphasis', band.emphasis],
    ['--bb-heading-transform', heading.transform],
    ['--bb-heading-tracking', heading.tracking],
    ['--bb-heading-scale', String(heading.scale)],
    ['--bb-texture', texture.image],
    ['--bb-texture-size', texture.size],
    ['--bb-border-color', depth.borderColor],
    ['--bb-border-width', px(depth.borderWidth)],
    ['--bb-shadow-card', depth.card],
    ['--bb-shadow-raised', depth.raised],
    ['--bb-duration', `${motion.durationMs}ms`],
    ['--bb-easing', motion.easing],
    ['--bb-stagger', `${motion.staggerMs}ms`],
    ['--bb-columns', String(layout.columns)],
    ['--bb-gutter', px(layout.gutter)],
    ['--bb-max-width', px(layout.maxWidth)],
    ['--bb-content-offset', String(layout.contentOffset)],
    ['--bb-control-height', px(layout.controlHeight)],
  ]);
}
