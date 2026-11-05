import { defineTweaks } from './build';
import { pageInput, select, text as textInput, toggle } from './shared';

const CHART_ADVICE: Record<string, string> = {
  line: 'Use it for change over time, with no more than 5 lines.',
  bar: 'Start the axis at zero, and sort bars by value unless the order means something.',
  area: 'Avoid stacking more than 3 series, because the upper layers become hard to read.',
  scatter: 'Use it to show relationships between two measures, and label only key points.',
  donut: 'Avoid this for more than 5 segments; a sorted bar chart reads better. Never use it for change over time.',
};

export const chartTweaks = defineTweaks('Charts', [
  {
    id: 'change-chart-type',
    title: 'Change chart type',
    inputs: [pageInput, textInput('chart', 'Chart', '<chart name>'), select('type', 'New type', Object.keys(CHART_ADVICE))],
    lines: ({ text }) => [
      `Change the ${text('chart')} chart on the ${text('page')} page to a ${text('type')} chart.`,
      `- ${CHART_ADVICE[text('type')] ?? ''}`,
      '- Keep the same data and labels.',
      "- Don't change any other chart.",
    ],
    check: 'the chart still reads clearly',
  },
  {
    id: 'brand-charts',
    title: 'Apply brand palette to charts',
    inputs: [textInput('colours', 'Colours', '<your palette, e.g. #1F5C45, #C2763A, #3D6A9E>')],
    lines: ({ text }) => [
      `Replace the default chart colours with this palette: ${text('colours')}.`,
      '- Define it once and use it for every chart.',
      '- Keep each category the same colour across charts.',
      '- Check colours stay distinct for colour-blind readers.',
    ],
    check: 'no default library colours remain',
  },
  {
    id: 'chart-annotations',
    title: 'Add annotations',
    inputs: [pageInput, textInput('moment', 'What to mark', '<the moment to mark>')],
    lines: ({ text }) => [
      `Annotate the main chart on the ${text('page')} page to mark ${text('moment')}.`,
      '- A short label next to the data, not in a legend.',
      '- A thin line or marker in a muted colour.',
    ],
    check: 'the annotation does not overlap the data',
  },
  {
    id: 'uncertainty-bands',
    title: 'Add uncertainty bands',
    inputs: [pageInput, select('range', 'Range', ['low and high estimates', '90% interval', '50% and 90% intervals'])],
    lines: ({ text }) => [
      `Add uncertainty bands to the main chart on the ${text('page')} page, showing ${text('range')}.`,
      '- A light shaded band behind a solid central line.',
      '- Say what the band means in the chart subtitle.',
    ],
    check: 'the central line stays easy to follow',
  },
  {
    id: 'simplify-charts',
    title: 'Simplify gridlines and axes',
    inputs: [toggle('direct', 'Label lines directly', true)],
    lines: ({ on }) => [
      'Simplify every chart.',
      '- Keep only light horizontal gridlines, and remove borders and background fills.',
      '- Reduce axes to 3 to 5 ticks.',
      ...(on('direct') ? ['- Label lines directly and remove the legend where possible.'] : []),
    ],
    check: 'charts still have readable scales',
  },
]);
