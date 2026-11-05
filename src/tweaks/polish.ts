import { AVOID_ITEMS } from '@/tokens/defaults';
import { defineTweaks } from './build';
import { SCOPE, select } from './shared';

export const polishTweaks = defineTweaks('Polish & accessibility', [
  {
    id: 'consistent-icons',
    title: 'Consistent icon set',
    inputs: [select('set', 'Icon set', ['lucide-react', 'Phosphor', 'Heroicons'])],
    lines: ({ text }) => [
      `Use ${text('set')} for every icon.`,
      '- Replace emoji and mixed icon styles.',
      '- Use one size and stroke width.',
      '- Give icon-only buttons an accessible label.',
      `- ${SCOPE}`,
    ],
    check: 'no emoji or mismatched icons remain',
  },
  {
    id: 'focus-states',
    title: 'Visible focus states',
    lines: () => [
      'Add a visible focus ring to every interactive element.',
      '- Use the accent colour, 2px with a 2px offset.',
      '- Use `:focus-visible`, and never remove outlines without a replacement.',
      `- ${SCOPE}`,
    ],
    check: 'you can see where you are when tabbing through',
  },
  {
    id: 'keyboard-nav',
    title: 'Keyboard navigation',
    lines: () => [
      'Make the whole app usable by keyboard.',
      '- Every control can be reached in a logical order.',
      '- Menus, dialogs and tabs follow standard key patterns.',
      '- Add a "Skip to content" link.',
      `- ${SCOPE}`,
    ],
    check: 'nothing traps the keyboard or needs a mouse',
  },
  {
    id: 'alt-text',
    title: 'Alt text',
    lines: () => [
      'Add useful alt text to every image.',
      '- Describe the purpose, not the file.',
      '- Give decorative images an empty alt, and charts a short summary of the finding.',
      `- ${SCOPE}`,
    ],
    check: 'no image is missing alt text',
  },
  {
    id: 'remove-ai-tells',
    title: 'Remove AI-generic tells',
    lines: () => [
      'Remove the signs of generic AI-made UI:',
      ...AVOID_ITEMS.map((item) => `- ${item.label}`),
      `${SCOPE}`,
    ],
    check: 'it no longer looks like a default template',
  },
]);
