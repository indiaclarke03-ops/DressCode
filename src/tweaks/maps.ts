import { defineTweaks } from './build';
import { color, pageInput, select, text as textInput } from './shared';

const MAP_TYPES = ['point map', 'choropleth', 'heatmap', 'flow map', 'hexbin map'];

const MAP_DETAILS: Record<string, (metric: string, low: string, high: string) => string> = {
  'point map': (metric) => `Size each point by ${metric}.`,
  choropleth: (metric, low, high) => `Shade regions by ${metric} using a sequential scale from ${low} to ${high} (5 steps).`,
  heatmap: (metric, low, high) => `Show density of ${metric} using a scale from ${low} to ${high}.`,
  'flow map': (metric) => `Draw curved lines between places, with width showing ${metric}.`,
  'hexbin map': (metric, low, high) => `Group points into hexagons coloured by ${metric}, from ${low} to ${high}.`,
};

export const mapTweaks = defineTweaks('Maps', [
  {
    id: 'change-map-type',
    title: 'Change map type',
    inputs: [
      pageInput,
      select('from', 'From', MAP_TYPES),
      select('to', 'To', ['choropleth', 'point map', 'heatmap', 'flow map', 'hexbin map']),
      textInput('metric', 'Metric', '<metric>'),
      color('low', 'Low', '#E8F0EC'),
      color('high', 'High', '#1F5C45'),
    ],
    lines: ({ text }) => [
      `Change the map on the ${text('page')} page from a ${text('from')} to a ${text('to')}.`,
      `- ${MAP_DETAILS[text('to')]?.(text('metric'), text('low'), text('high')) ?? ''}`,
      '- Add a legend in the bottom-left showing the steps and their ranges.',
      '- Keep hover tooltips showing region name and value.',
      "- Don't change the data loading or any other page.",
    ],
    check: 'the legend is readable',
  },
  {
    id: 'change-basemap',
    title: 'Change basemap style',
    inputs: [pageInput, select('style', 'Style', ['minimal light', 'minimal dark', 'none, shapes only'])],
    lines: ({ text }) => [
      `Change the basemap on the ${text('page')} page to ${text('style')}.`,
      '- Remove labels and colours that compete with the data.',
      '- Keep the data layers on top.',
      "- Don't change the data or the map interactions.",
    ],
    check: 'the data is the loudest thing on the map',
  },
  {
    id: 'map-colour-scale',
    title: 'Change colour scale',
    inputs: [pageInput, select('scale', 'Scale', ['sequential', 'diverging']), color('low', 'Low', '#E8F0EC'), color('high', 'High', '#1F5C45')],
    lines: ({ text }) => [
      `Change the map colours on the ${text('page')} page to a ${text('scale')} scale from ${text('low')} to ${text('high')}.`,
      '- Use 5 steps, with clear breaks between them.',
      '- Update the legend to match.',
    ],
    check: 'neighbouring steps can be told apart',
  },
  {
    id: 'add-legend',
    title: 'Add legend',
    inputs: [pageInput, select('position', 'Position', ['bottom left', 'bottom right', 'top right'])],
    lines: ({ text }) => [
      `Add a legend to the map on the ${text('page')} page, ${text('position')}.`,
      '- Show every colour or size used, with units.',
      "- Don't let it cover important data on phones.",
    ],
    check: 'the legend matches the map exactly',
  },
  {
    id: 'map-tooltips',
    title: 'Add hover tooltips',
    inputs: [pageInput, textInput('fields', 'Show', '<fields to show>')],
    lines: ({ text }) => [
      `Add hover tooltips to the map on the ${text('page')} page showing ${text('fields')}.`,
      '- Make them work on tap too, for phones.',
      '- Keep them inside the map area.',
    ],
    check: 'tooltips stay on screen at the edges',
  },
  {
    id: 'map-side-panel',
    title: 'Add a details side panel',
    inputs: [pageInput, textInput('fields', 'Show', '<details to show>')],
    lines: ({ text }) => [
      `Add a side panel to the ${text('page')} page that opens when a place is selected, showing ${text('fields')}.`,
      '- On phones, open it as a bottom sheet.',
      '- Close with a button and with Escape.',
    ],
    check: 'the map stays usable with the panel open',
  },
  {
    id: 'map-library',
    title: 'Choose library',
    inputs: [pageInput, select('library', 'Library', ['MapLibre', 'Leaflet', 'D3'])],
    lines: ({ text }) => [
      `Rebuild the map on the ${text('page')} page with ${text('library')}.`,
      '- Keep the data, colours and interactions the same.',
      '- Remove the old map library if nothing else uses it.',
    ],
    check: 'the map looks and behaves the same',
  },
]);
