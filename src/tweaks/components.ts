import { defineTweaks } from './build';
import { pageInput, select, text as textInput, toggle } from './shared';

export const componentTweaks = defineTweaks('Components', [
  {
    id: 'add-table',
    title: 'Add a table',
    inputs: [
      pageInput,
      textInput('data', 'Data', '<what the table shows>'),
      toggle('sortable', 'Sortable', true),
      toggle('filterable', 'Filterable', false),
      toggle('sticky', 'Sticky header', true),
      toggle('pagination', 'Pagination', false),
    ],
    lines: ({ text, on }) => [
      `Add a table to the ${text('page')} page showing ${text('data')}.`,
      ...(on('sortable') ? ['- Sortable columns, with a clear sort indicator.'] : []),
      ...(on('filterable') ? ['- A filter input above the table.'] : []),
      ...(on('sticky') ? ['- A sticky header that stays visible while scrolling.'] : []),
      ...(on('pagination') ? ['- Pagination, 25 rows a page.'] : []),
      '- Right-align numbers, and use tabular figures.',
      '- Scroll inside its own container on phones.',
    ],
    check: 'long values fit and the table is usable on a phone',
  },
  {
    id: 'add-cards',
    title: 'Add cards',
    inputs: [pageInput, textInput('content', 'Content', '<what each card shows>'), select('columns', 'Per row', ['3', '2', '4'])],
    lines: ({ text }) => [
      `Add a row of cards to the ${text('page')} page showing ${text('content')}.`,
      `- ${text('columns')} cards per row on desktop, one on phones.`,
      '- Match the existing card style and spacing.',
      '- Make the most important card visibly different, so they are not three identical boxes.',
    ],
    check: 'cards line up and stack cleanly',
  },
  {
    id: 'add-modal',
    title: 'Add a modal',
    inputs: [pageInput, textInput('purpose', 'Purpose', '<what the modal is for>')],
    lines: ({ text }) => [
      `Add a modal to the ${text('page')} page for ${text('purpose')}.`,
      '- Trap focus inside it, and return focus to the trigger on close.',
      '- Close with Escape, a close button and a click outside.',
      '- Use an accessible dialog component rather than building one from scratch.',
    ],
    check: 'it fits on a phone and works by keyboard',
  },
  {
    id: 'add-tabs',
    title: 'Add tabs',
    inputs: [pageInput, textInput('tabs', 'Tabs', '<tab names>')],
    lines: ({ text }) => [
      `Add tabs to the ${text('page')} page: ${text('tabs')}.`,
      '- Keep the selected tab when the page refreshes.',
      '- Arrow keys move between tabs.',
      '- Let tabs scroll sideways on phones instead of wrapping.',
    ],
    check: 'every tab panel works',
  },
  {
    id: 'add-empty-state',
    title: 'Add an empty state',
    inputs: [pageInput, textInput('what', 'Empty area', '<list or section>')],
    lines: ({ text }) => [
      `Add an empty state to ${text('what')} on the ${text('page')} page.`,
      '- One short sentence on why it is empty, and one clear action.',
      '- No placeholder copy.',
      "- Don't change what happens once there is data.",
    ],
    check: 'the empty state appears with no data',
  },
  {
    id: 'add-skeleton',
    title: 'Add a loading skeleton',
    inputs: [pageInput],
    lines: ({ text }) => [
      `Add a loading skeleton to the ${text('page')} page.`,
      '- Match the shape of the real content, so nothing jumps when it loads.',
      '- Keep any shimmer subtle, and remove it for reduced motion.',
      "- Don't change the data loading itself.",
    ],
    check: 'the page does not shift when content arrives',
  },
  {
    id: 'add-toasts',
    title: 'Add toast notifications',
    inputs: [textInput('event', 'Trigger', '<what triggers a toast>'), select('position', 'Position', ['bottom right', 'top right', 'bottom centre'])],
    lines: ({ text }) => [
      `Add toast notifications for ${text('event')}, ${text('position')}.`,
      '- Announce them to screen readers.',
      '- Dismiss after 5 seconds, and pause on hover.',
      '- Keep errors on screen until dismissed.',
    ],
    check: 'toasts do not cover key controls on a phone',
  },
]);
