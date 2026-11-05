import { defineTweaks } from './build';
import { SCOPE, select } from './shared';

export const motionTweaks = defineTweaks('Motion', [
  {
    id: 'remove-animations',
    title: 'Remove animations',
    inputs: [select('scope', 'Remove', ['all decorative animation', 'load animations only'])],
    lines: ({ text }) => [
      `Remove ${text('scope')}.`,
      '- Keep short state changes such as hover and focus.',
      `- ${SCOPE}`,
    ],
    check: 'nothing animates on load',
  },
  {
    id: 'subtle-transitions',
    title: 'Add subtle transitions',
    inputs: [select('speed', 'Speed', ['150ms', '120ms', '200ms'])],
    lines: ({ text }) => [
      `Add subtle transitions of ${text('speed')} ease-out to interactive elements.`,
      '- Colour and opacity only, on hover, focus and open or close.',
      '- No movement on load.',
      `- ${SCOPE}`,
    ],
    check: 'the interface feels responsive, not slow',
  },
  {
    id: 'reduced-motion',
    title: 'Respect reduced motion',
    lines: () => [
      'Respect the `prefers-reduced-motion` setting everywhere.',
      '- Turn off movement, parallax and auto-playing animation for people who ask.',
      '- Keep simple fades, and make sure nothing depends on animation to work.',
      `- ${SCOPE}`,
    ],
    check: 'the app still works with reduced motion on',
  },
]);
