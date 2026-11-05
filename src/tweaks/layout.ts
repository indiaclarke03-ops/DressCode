import { defineTweaks } from './build';
import { pageInput, SCOPE, select } from './shared';

export const layoutTweaks = defineTweaks('Layout & spacing', [
  {
    id: 'whitespace',
    title: 'More or less whitespace',
    inputs: [select('direction', 'Direction', ['more', 'less'])],
    lines: ({ text }) => [
      `Give the interface ${text('direction')} whitespace.`,
      '- Change the spacing scale rather than individual margins.',
      '- Keep related items closer together than unrelated ones.',
      `- ${SCOPE}`,
    ],
    check: 'the spacing feels consistent across screens',
  },
  {
    id: 'nav-position',
    title: 'Switch to sidebar or top nav',
    inputs: [select('nav', 'Navigation', ['a left sidebar', 'a top bar'])],
    lines: ({ text }) => [
      `Move the main navigation to ${text('nav')}.`,
      '- Keep every link and its order.',
      '- Show the active page clearly.',
      '- On phones, collapse it into a menu.',
      `- ${SCOPE}`,
    ],
    check: 'navigation works at both widths',
  },
  {
    id: 'responsive',
    title: 'Make it responsive for mobile',
    inputs: [pageInput],
    lines: ({ text }) => [
      `Make the ${text('page')} page work well on phones.`,
      '- No sideways scrolling at 390px.',
      '- Stack columns, and keep tap targets at least 44px.',
      '- Make wide tables scroll inside their own container.',
      `- ${SCOPE}`,
    ],
    check: 'nothing is cut off at 390px',
  },
  {
    id: 'align-grid',
    title: 'Align to a grid',
    inputs: [pageInput, select('columns', 'Columns', ['12', '8', '6'])],
    lines: ({ text }) => [
      `Align everything on the ${text('page')} page to a ${text('columns')}-column grid.`,
      '- Use one set of gutters and page margins.',
      '- Replace one-off widths with column spans.',
      `- ${SCOPE}`,
    ],
    check: 'left and right edges line up down the page',
  },
  {
    id: 'card-height',
    title: 'Make cards consistent height',
    inputs: [pageInput],
    lines: ({ text }) => [
      `Make the cards on the ${text('page')} page the same height in each row.`,
      '- Use grid or flex stretching, not fixed heights.',
      '- Pin buttons to the bottom of each card.',
      `- ${SCOPE}`,
    ],
    check: 'cards still line up with long content',
  },
]);
