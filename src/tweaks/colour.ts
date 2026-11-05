import { generatePalette } from '@/tokens/palette';
import { defineTweaks } from './build';
import { color, SCOPE, select } from './shared';

const PRESETS: Record<string, { accent: string; neutral: 'warm' | 'cool' | 'neutral' }> = {
  'Quiet green': { accent: '#1F5C45', neutral: 'warm' },
  'Ink and paper': { accent: '#1F3A5F', neutral: 'cool' },
  Terracotta: { accent: '#B84A26', neutral: 'warm' },
  Graphite: { accent: '#3A3A36', neutral: 'neutral' },
};

export const colourTweaks = defineTweaks('Colour', [
  {
    id: 'change-accent',
    title: 'Change accent colour',
    inputs: [color('from', 'From', '#7C3AED'), color('to', 'To', '#1F5C45')],
    lines: ({ text }) => [
      `Change the accent colour from ${text('from')} to ${text('to')} everywhere it appears.`,
      '- Update buttons, links, active states and focus rings.',
      '- Replace any hard-coded uses with one variable.',
      `- Make sure text on the new accent still passes WCAG AA.`,
      `- ${SCOPE}`,
    ],
    check: 'no trace of the old colour remains',
  },
  {
    id: 'change-palette',
    title: 'Change whole palette',
    inputs: [select('preset', 'Preset', Object.keys(PRESETS))],
    lines: ({ text }) => {
      const preset = PRESETS[text('preset')] ?? { accent: '#1F5C45', neutral: 'warm' as const };
      const palette = generatePalette(preset.accent, preset.neutral, 'light');
      return [
        `Change the whole colour palette to "${text('preset')}".`,
        `- Background ${palette.background}, surface ${palette.surface}, border ${palette.border}.`,
        `- Text ${palette.text}, muted text ${palette.textMuted}.`,
        `- Accent ${palette.accent}, with ${palette.accentForeground} on top of it.`,
        '- Define these as variables in one place and replace hard-coded colours.',
        `- ${SCOPE}`,
      ];
    },
    check: 'every screen uses the new palette',
  },
  {
    id: 'add-dark-mode',
    title: 'Add dark mode',
    inputs: [select('trigger', 'Controlled by', ['a header toggle', 'the system setting', 'both'])],
    lines: ({ text }) => [
      `Add dark mode, controlled by ${text('trigger')}.`,
      '- Define dark values for every colour variable, rather than inverting colours.',
      '- Keep shadows and borders visible on dark surfaces.',
      '- Remember the choice between visits, and avoid a flash of the wrong theme on load.',
      `- ${SCOPE}`,
    ],
    check: 'both themes look finished',
  },
  {
    id: 'fix-contrast',
    title: 'Fix low contrast',
    lines: () => [
      'Find every text and background pair that fails WCAG AA, and fix it.',
      '- Body text needs 4.5:1, large text and icons 3:1.',
      '- Adjust the colour by the smallest amount that passes, and keep the hue.',
      '- List each change: old colour, new colour, where it was used.',
      `- ${SCOPE}`,
    ],
    check: 'muted text and disabled states are readable',
  },
  {
    id: 'muted-vibrant',
    title: 'Make it more muted or vibrant',
    inputs: [select('direction', 'Direction', ['more muted', 'more vibrant'])],
    lines: ({ text }) => [
      `Make the colours ${text('direction')}.`,
      '- Change saturation, not hue, so the palette stays recognisable.',
      '- Keep neutrals as they are and adjust only accent and data colours.',
      '- Keep all text at WCAG AA contrast.',
      `- ${SCOPE}`,
    ],
    check: 'the change is noticeable but still feels like the same product',
  },
]);
