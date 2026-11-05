import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { direction } from './designMd';
import { BEFORE_YOU_FINISH, doNotLines, sentenceList, styleTitle, withArticle } from './shared';

export const MEDIUMS = [
  { id: 'website', label: 'Website', noun: 'website' },
  { id: 'webapp', label: 'Web app', noun: 'web app' },
  { id: 'slides', label: 'Slide deck', noun: 'slide deck' },
  { id: 'graphic', label: 'Graphic or social post', noun: 'graphic' },
  { id: 'document', label: 'Document or report', noun: 'document' },
  { id: 'other', label: 'Something else', noun: 'piece of work' },
] as const;

export type MediumId = (typeof MEDIUMS)[number]['id'];

const MEDIUM_RULES: Record<MediumId, string[]> = {
  website: [
    'Use the spacing and radius values exactly',
    'Make it responsive from 390px to 1440px',
  ],
  webapp: [
    'Use the spacing and radius values exactly',
    'Design loading, empty and error states too',
    'Make every control reachable by keyboard',
  ],
  slides: [
    'Use slide-sized type: headings 40pt or larger, body 20pt or larger',
    'One idea per slide, with a title that states the point',
    'Use the accent once per slide, on the thing that matters most',
    'Use the background colour for slides, and keep margins generous',
  ],
  graphic: [
    'Use only the colours and fonts listed here',
    'One focal point, with the accent on it',
    'Keep text short and readable at phone size',
    'Export at the exact size the platform asks for',
  ],
  document: [
    'Headings in the heading font, body text in the body font',
    'Keep lines to 60 to 75 characters, with generous margins',
    'Use the accent for headings or rules only, never for body text',
    'Tables use hairline rules and right-aligned numbers',
  ],
  other: ['Apply the colours, fonts and do-not list as closely as the format allows'],
};

const MEDIUM_CHECKS: Record<MediumId, string[]> = {
  website: BEFORE_YOU_FINISH,
  webapp: BEFORE_YOU_FINISH,
  slides: [
    'Check every slide against this style, especially "Do not".',
    'Check text is readable at the back of a room.',
  ],
  graphic: ['Check the result against this style, especially "Do not".', 'Check it still reads at thumbnail size.'],
  document: ['Check every page against this style, especially "Do not".', 'Check text contrast meets WCAG AA.'],
  other: ['Check the result against this style, especially "Do not".', 'Check text is easy to read.'],
};

/** A short prompt to paste before making anything in a saved style. */
export function stylePrompt(
  config: DesignConfig,
  tokens: DesignTokens,
  medium: MediumId,
  custom = '',
): string {
  const { colors, fonts, spacing, radius } = tokens;
  const noun = MEDIUMS.find((item) => item.id === medium)?.noun ?? 'piece of work';
  const subject = medium === 'other' && custom.trim() ? custom.trim() : withArticle(noun);
  const isScreen = medium === 'website' || medium === 'webapp';
  const doNot = doNotLines(config);

  return [
    `Before you start, follow the "${styleTitle(config)}" brand style. We're making ${subject}.`,
    '',
    `The look: ${direction(config)}`,
    '',
    'Colours:',
    `- Background ${colors.background}, surface ${colors.surface}, border ${colors.border}`,
    `- Text ${colors.text}, muted text ${colors.textMuted}`,
    `- Accent ${colors.accent}, with ${colors.accentForeground} on top of it`,
    '',
    'Fonts:',
    `- Headings: ${fonts.heading.family} ${fonts.heading.weight}`,
    `- Body: ${fonts.body.family} ${fonts.body.weight}`,
    `- Numbers: ${fonts.mono.family}`,
    '',
    ...(isScreen
      ? ['Shape:', `- Spacing: ${spacing.join(', ')}`, `- Radius: ${radius.control}px controls, ${radius.card}px cards`, '']
      : []),
    `For this ${noun}:`,
    sentenceList(MEDIUM_RULES[medium]),
    '',
    ...(doNot.length ? ['Do not:', sentenceList(doNot), ''] : []),
    'Before you finish:',
    ...MEDIUM_CHECKS[medium].map((line, index) => `${index + 1}. ${line}`),
    '',
  ].join('\n');
}
