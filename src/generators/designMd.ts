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

const MOOD = { still: 'calm', quiet: 'calm', expressive: 'lively' };
const FIT = { compact: 'information-dense', airy: 'spacious', oversized: 'large-scale, generous' };
const CORNERS = {
  none: 'square corners',
  sharp: 'sharp corners',
  soft: 'soft corners',
  pill: 'pill-shaped controls',
};
const SURFACES = {
  flat: 'flat surfaces separated by hairline borders',
  layered: 'layered surfaces lifted by soft shadows',
  bold: 'thick outlines with hard offset shadows',
  borderless: 'borderless surfaces separated by tone alone',
};
const VOICE = {
  sans: 'Typography carries the hierarchy, not colour.',
  serif: 'Serif headings give it an editorial voice.',
  display: 'Heavy display headings set the tone.',
  mono: 'Monospaced headings give it a technical voice.',
};
const HEADING_CASE = {
  sentence: '',
  uppercase: 'Headings are uppercase and tracked out.',
  oversized: 'Headings run oversized and tight.',
};
const TEXTURE = {
  none: '',
  grain: 'A faint paper grain sits over the page.',
  dots: 'A fine dot grid sits behind the page.',
  lines: 'Fine ruled lines sit behind the page.',
};
const LAYOUT = {
  grid: 'Everything sits on a strict grid.',
  editorial: 'Layouts are asymmetrical and deliberately uneven, like a well-set magazine page.',
  bento: 'Content sits in a bento grid of unequal tiles.',
  poster: 'Layouts work like posters: one big idea per screen, at full width.',
};

function surfaceSentence(config: DesignConfig, colour: string): string {
  const treatment = `${CORNERS[config.radius]}, ${SURFACES[config.depth]}.`;
  if (config.theme === 'tinted') return `A softly tinted ${colour} page, ${treatment}`;
  if (config.theme === 'vivid') return `Pages drenched in ${colour}, ${treatment}`;
  return `${capitalise(config.theme)} theme, ${treatment}`;
}

function colourSentence(config: DesignConfig, colour: string): string {
  const used = {
    monochrome: 'Black and white only: no accent colour, so contrast does all the work.',
    'mono-accent': `One ${colour} accent used sparingly for primary actions and highlights.`,
    duotone: `Two colours only: ${colour} and its near-opposite.`,
    expressive: `A ${colour} accent leads a wider palette that brings energy to charts, tags and highlights.`,
  }[config.colorStrategy];
  return config.colorUse === 'blocks' ? `${used} Colour fills nav bars, headers and hero blocks.` : used;
}

export function direction(config: DesignConfig): string {
  const colour = describeColour(config.accent);
  return [
    `A ${MOOD[config.motion]}, ${FIT[config.density]} ${projectNoun(config)}.`,
    surfaceSentence(config, colour),
    colourSentence(config, colour),
    VOICE[config.headingStyle],
    HEADING_CASE[config.headingCase],
    TEXTURE[config.texture],
    LAYOUT[config.layout],
  ]
    .filter(Boolean)
    .join(' ');
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
    ['accent-text', colors.accentText, 'Links and any text in the accent colour'],
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

const HEADING_RULE = {
  sentence: '',
  uppercase: '- Headings: uppercase, letter-spacing 0.04em',
  oversized: '- Headings: oversized, tight tracking (-0.03em). Let them dominate',
};

function typography({ fonts, type, heading: treatment }: DesignTokens): string {
  const { heading, body, mono } = fonts;
  return [
    `- Headings: ${heading.family} ${heading.weight} · Body: ${body.family} ${body.weight}, ${type.baseSize}px base · Numbers: ${mono.family}, tabular figures`,
    `- Scale: ${type.ratio} (${type.sizes.join(' / ')})`,
    `- Line height: ${type.lineHeight} for body text`,
    HEADING_RULE[treatment.case],
    '- All three families are on Google Fonts',
  ]
    .filter(Boolean)
    .join('\n');
}

function depthRule({ depth }: DesignTokens): string {
  if (depth.strategy === 'flat') return 'No shadows. Use 1px borders.';
  if (depth.strategy === 'borderless') {
    return 'No borders or shadows. Separate surfaces by tone and spacing.';
  }
  if (depth.strategy === 'bold') {
    return `${depth.borderWidth}px solid ${depth.borderColor} borders, with a hard shadow: \`${depth.card}\`. No blur.`;
  }
  return `No card borders. Cards: \`${depth.card}\`. Raised panels: \`${depth.raised}\`.`;
}

function motionRule({ motion }: DesignTokens): string {
  if (motion.durationMs === 0) return 'None. State changes are instant; nothing animates.';
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
  if (layout.kind === 'bento') lines.push('Tiles span different sizes; the most important one is largest');
  if (layout.kind === 'poster') lines.push('Sections run full width, with one dominant element each');
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
    ...(tokens.texture.kind === 'none'
      ? []
      : [`- Background texture: ${tokens.texture.kind}, faint. Apply it to the page, not to cards.`]),
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
