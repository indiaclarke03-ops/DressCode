import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { projectRules } from './projectRules';
import {
  beforeYouFinish,
  describeColour,
  doNotLines,
  projectLabel,
  projectNoun,
  sentenceList,
  styleTitle,
} from './shared';

const capitalise = (text: string) => `${text[0]?.toUpperCase()}${text.slice(1)}`;

export function direction(config: DesignConfig): string {
  const mood = config.motion === 'quiet' ? 'calm' : 'lively';
  const fit = config.density === 'compact' ? 'information-dense' : 'spacious';
  const corners = config.radius === 'sharp' ? 'sharp corners' : 'soft corners';
  const surfaces =
    config.depth === 'flat'
      ? 'flat surfaces separated by hairline borders'
      : 'layered surfaces lifted by soft shadows';
  const colour = describeColour(config.accent);
  const accent =
    config.colorStrategy === 'mono-accent'
      ? `One ${colour} accent used sparingly for primary actions and highlights.`
      : `A ${colour} accent leads a wider palette that brings energy to charts, tags and highlights.`;
  const voice =
    config.headingStyle === 'serif'
      ? 'Serif headings give it an editorial voice.'
      : 'Typography carries the hierarchy, not colour.';
  const layout =
    config.layout === 'editorial'
      ? 'Layouts are asymmetrical and deliberately uneven, like a well-set magazine page.'
      : 'Everything sits on a strict grid.';

  return `A ${mood}, ${fit} ${projectNoun(config)}. ${capitalise(config.theme)} theme, ${corners}, ${surfaces}. ${accent} ${voice} ${layout}`;
}

function colourTable({ colors }: DesignTokens): string {
  const rows: [string, string, string][] = [
    ['background', colors.background, 'Page background'],
    ['surface', colors.surface, 'Cards, panels'],
    ['surface-raised', colors.surfaceRaised, 'Menus, dialogs, anything above a card'],
    ['border', colors.border, 'Dividers, card outlines'],
    ['text', colors.text, 'Primary text'],
    ['text-muted', colors.textMuted, 'Secondary text, labels'],
    ['accent', colors.accent, 'Primary buttons, active states, key data'],
    ['accent-foreground', colors.accentForeground, 'Text and icons on accent'],
    ['success', colors.success, 'Positive states'],
    ['warning', colors.warning, 'Cautions'],
    ['danger', colors.danger, 'Errors, destructive actions'],
  ];
  return [
    '| Token | Value | Use |',
    '|---|---|---|',
    ...rows.map(([token, value, use]) => `| ${token} | ${value} | ${use} |`),
  ].join('\n');
}

function dataPalette({ data, includeDataPalette }: DesignTokens): string {
  if (!includeDataPalette) return '';
  return [
    '',
    `Data palette (categorical): ${data.categorical.join(', ')}`,
    `Sequential: ${data.sequential[0]} → ${data.sequential.at(-1)}`,
    `Diverging: ${data.diverging[0]} → ${data.diverging[3]} → ${data.diverging.at(-1)}`,
  ].join('\n');
}

function typography({ fonts, type }: DesignTokens): string {
  const { heading, body, mono } = fonts;
  return [
    `- Headings: ${heading.family} ${heading.weight} · Body: ${body.family} ${body.weight}, ${type.baseSize}px base · Numbers: ${mono.family}, tabular figures`,
    `- Scale: ${type.ratio} (${type.sizes.join(' / ')})`,
    `- Line height: ${type.lineHeight} for body text`,
    '- All three families are on Google Fonts',
  ].join('\n');
}

function depthRule({ depth }: DesignTokens): string {
  return depth.strategy === 'flat'
    ? 'No shadows. Use 1px borders.'
    : `No card borders. Cards: \`${depth.card}\`. Raised panels: \`${depth.raised}\`.`;
}

function motionRule({ motion }: DesignTokens): string {
  if (!motion.spring) {
    return `Quiet. Fades and colour transitions only, ${motion.durationMs}ms, ease-out. No load animations.`;
  }
  return `Expressive. ${motion.durationMs}ms with a slight overshoot (\`${motion.easing}\`). Stagger lists by ${motion.staggerMs}ms. Turn it all off for \`prefers-reduced-motion\`.`;
}

function layoutRules({ layout }: DesignTokens): string {
  const lines = [
    `${layout.columns}-column grid, ${layout.gutter}px gutters, ${layout.maxWidth}px max width`,
    `Controls and inputs are ${layout.controlHeight}px tall`,
    'Left-align text',
  ];
  if (layout.kind === 'editorial') {
    lines.push(`Offset main content by ${layout.contentOffset} columns; let images and pull quotes break the grid`);
  }
  return sentenceList(lines);
}

/** The body shared by DESIGN.md and SKILL.md. */
export function briefBody(config: DesignConfig, tokens: DesignTokens): string {
  const { title, rules } = projectRules(config);
  const doNot = doNotLines(config);

  return [
    `# Design Brief: ${styleTitle(config)}`,
    `Project type: ${projectLabel(config)}`,
    '',
    '## Direction',
    direction(config),
    '',
    '## Colour tokens',
    colourTable(tokens) + dataPalette(tokens),
    '',
    '## Typography',
    typography(tokens),
    '',
    '## Spacing, radius, depth',
    `- Spacing: ${tokens.spacing.join(', ')}`,
    `- Radius: ${tokens.radius.control}px (inputs, buttons), ${tokens.radius.card}px (cards)`,
    `- ${depthRule(tokens)}`,
    '',
    '## Motion',
    motionRule(tokens),
    '',
    '## Layout rules',
    layoutRules(tokens),
    '',
    `## ${title}`,
    sentenceList(rules),
    '',
    ...(doNot.length ? ['## Do not', sentenceList(doNot), ''] : []),
    beforeYouFinish(),
    '',
  ].join('\n');
}

export function designMd(config: DesignConfig, tokens: DesignTokens): string {
  return briefBody(config, tokens);
}
