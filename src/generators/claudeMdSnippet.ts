import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { BEFORE_YOU_FINISH, doNotLines, styleTitle } from './shared';

const MAX_DO_NOT_LINES = 12;

export function claudeMdSnippet(config: DesignConfig, tokens: DesignTokens): string {
  const { colors, fonts, type, spacing, radius, depth } = tokens;
  const doNot = doNotLines(config);
  const shown = doNot.slice(0, MAX_DO_NOT_LINES);
  const hidden = doNot.length - shown.length;

  return [
    '## Design system',
    `Follow the "${styleTitle(config)}" style for all UI work.`,
    '',
    `- Colours: background ${colors.background}, surface ${colors.surface}, border ${colors.border}, text ${colors.text}, muted ${colors.textMuted}, accent ${colors.accent} (text on accent ${colors.accentForeground})`,
    `- Fonts: ${fonts.heading.family} ${fonts.heading.weight} for headings, ${fonts.body.family} ${fonts.body.weight} for body, ${fonts.mono.family} for numbers`,
    `- Type: ${type.baseSize}px base, scale ${type.sizes.join(' / ')}`,
    `- Spacing: ${spacing.join(', ')}`,
    `- Radius: ${radius.control}px controls, ${radius.card}px cards`,
    `- Depth: ${depth.strategy === 'flat' ? 'no shadows, 1px borders' : 'soft shadows, no card borders'}`,
    '',
    ...(shown.length ? ['### Do not', ...shown.map((line) => `- ${line}`)] : []),
    ...(hidden > 0 ? [`- Plus ${hidden} more in DESIGN.md`] : []),
    '',
    '### Before you finish',
    ...BEFORE_YOU_FINISH.map((line, index) => `${index + 1}. ${line}`),
    '',
  ].join('\n');
}
