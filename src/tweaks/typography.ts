import { FONT_PAIRINGS } from '@/tokens/fontPairings';
import { defineTweaks } from './build';
import { pageInput, SCOPE, select } from './shared';

export const typographyTweaks = defineTweaks('Typography', [
  {
    id: 'change-fonts',
    title: 'Change font pairing',
    inputs: [select('pairing', 'Pairing', FONT_PAIRINGS.map((pairing) => pairing.name))],
    lines: ({ text }) => {
      const pairing = FONT_PAIRINGS.find((item) => item.name === text('pairing')) ?? FONT_PAIRINGS[0];
      return [
        `Change the fonts to ${text('pairing')}.`,
        `- Headings: ${pairing?.heading.family} ${pairing?.heading.weight}. Body: ${pairing?.body.family} ${pairing?.body.weight}.`,
        '- Load them from Google Fonts with display=swap, and only the weights used.',
        '- Set them once, as variables, rather than per component.',
        `- ${SCOPE}`,
      ];
    },
    check: 'no old font remains',
  },
  {
    id: 'heading-size',
    title: 'Make headings bigger or smaller',
    inputs: [select('direction', 'Direction', ['bigger', 'smaller']), select('amount', 'By', ['one step', 'two steps'])],
    lines: ({ text }) => [
      `Make all headings ${text('direction')} by ${text('amount')} on the type scale.`,
      '- Keep the order of sizes between heading levels.',
      '- Adjust spacing around headings to suit.',
      `- ${SCOPE}`,
    ],
    check: 'long headings still wrap cleanly',
  },
  {
    id: 'tabular-numbers',
    title: 'Use tabular numbers',
    lines: () => [
      'Use tabular figures for all numbers that sit in columns or change value.',
      '- Add `font-variant-numeric: tabular-nums` to tables, stats and counters.',
      '- Right-align numeric table columns.',
      `- ${SCOPE}`,
    ],
    check: 'digits line up in columns',
  },
  {
    id: 'line-length',
    title: 'Tighten line length for reading',
    inputs: [pageInput, select('length', 'Length', ['65 characters', '75 characters', '55 characters'])],
    lines: ({ text }) => [
      `Limit body text on the ${text('page')} page to about ${text('length')} a line.`,
      '- Set a max-width in `ch` on the text container.',
      '- Let images, tables and charts stay wider.',
      `- ${SCOPE}`,
    ],
    check: 'paragraphs are comfortable to read',
  },
]);
