import { defineTweaks } from './build';
import { pageInput, select, text as textInput } from './shared';

export const simulatorTweaks = defineTweaks('Simulators & inputs', [
  {
    id: 'inputs-to-sliders',
    title: 'Swap inputs for sliders',
    inputs: [pageInput, textInput('inputs', 'Inputs', '<which inputs>')],
    lines: ({ text }) => [
      `Replace ${text('inputs')} on the ${text('page')} page with sliders.`,
      '- Show the current value and units beside each slider.',
      '- Keep the same minimum, maximum and step.',
      '- Keep arrow-key control.',
      "- Don't change the calculation.",
    ],
    check: 'results match the old inputs',
  },
  {
    id: 'preset-scenarios',
    title: 'Add preset scenarios',
    inputs: [pageInput, textInput('presets', 'Presets', '<scenario names>')],
    lines: ({ text }) => [
      `Add preset scenarios to the ${text('page')} page: ${text('presets')}.`,
      '- One click sets every input.',
      '- Show which preset is active, and clear it once an input changes.',
      "- Don't change the calculation.",
    ],
    check: 'each preset gives the expected result',
  },
  {
    id: 'output-ranges',
    title: 'Show output ranges',
    inputs: [pageInput, select('label', 'Label as', ['likely range', 'low and high estimates'])],
    lines: ({ text }) => [
      `Show results on the ${text('page')} page as a ${text('label')}, not just a single number.`,
      '- Keep the central value as the main figure.',
      '- Use the range the model already produces; ask me if it does not produce one.',
    ],
    check: 'the range reads clearly next to the main number',
  },
  {
    id: 'reset-defaults',
    title: 'Add a "reset to defaults" button',
    inputs: [pageInput],
    lines: ({ text }) => [
      `Add a "Reset to defaults" button to the ${text('page')} page.`,
      '- Put it near the inputs, as a quiet secondary action.',
      '- Disable it when nothing has changed.',
    ],
    check: 'every input returns to its default',
  },
  {
    id: 'live-headline',
    title: 'Show a live-updating headline number',
    inputs: [pageInput, textInput('metric', 'Metric', '<headline metric>')],
    lines: ({ text }) => [
      `Show ${text('metric')} as a large headline number on the ${text('page')} page, updating live as inputs change.`,
      '- Keep it in view while people use the controls.',
      '- Use tabular figures, so it does not jitter.',
      '- Announce changes politely to screen readers.',
    ],
    check: 'it stays visible on a phone',
  },
]);
