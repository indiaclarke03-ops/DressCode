import type { DesignConfig, ProjectType } from '@/tokens/types';

interface ProjectRuleSet {
  title: string;
  /** Always true of this kind of project. */
  base: string[];
}

const WEB_APP: ProjectRuleSet = {
  title: 'App rules',
  base: ['Every screen needs a clear primary action', 'Design loading, empty and error states, not just the full state'],
};
const SHOWCASE: ProjectRuleSet = {
  title: 'Page rules',
  base: ['One clear call to action per section', 'Write specific copy; every claim should be something only this project could say'],
};
const READING: ProjectRuleSet = {
  title: 'Reading rules',
  base: ['Keep body text at 60 to 75 characters a line', 'Give headings more space above than below'],
};
const DATA_STORY: ProjectRuleSet = {
  title: 'Story rules',
  base: ['Lead each chart with the finding, not the topic', 'Keep reading width constant; let charts break out only when they need to'],
};

const RULE_SETS: Record<ProjectType, ProjectRuleSet> = {
  dashboard: {
    title: 'Dashboard rules',
    base: ['Tabular figures; right-align numeric columns', 'Put the most important number top left'],
  },
  simulator: {
    title: 'Simulator rules',
    base: ['Outputs update live as inputs change', 'Add preset scenarios and a reset to defaults'],
  },
  map: {
    title: 'Map rules',
    base: ['The data is the loudest thing on the map', 'Every colour on the map appears in the legend'],
  },
  chat: {
    title: 'Chat rules',
    base: ['Show a clear state while the assistant is responding', 'Keep the message box reachable at all times'],
  },
  form: {
    title: 'Form rules',
    base: ['Put labels above fields, never only as placeholders', 'Show errors next to the field, in plain language'],
  },
  calculator: {
    title: 'Calculator rules',
    base: ['Show units on every input and output', 'Start with sensible defaults so a result shows straight away'],
  },
  ecommerce: {
    title: 'Storefront rules',
    base: ['Show price and availability without a click', 'Keep the basket reachable from every page'],
  },
  explainer: {
    title: 'Lesson rules',
    base: ['Teach one idea per section', 'Let people try something before explaining it'],
  },
  game: {
    title: 'Game rules',
    base: ['Show how to play within the first ten seconds', 'Keep controls readable at every screen size'],
  },
  docs: { ...READING, title: 'Docs rules' },
  portfolio: { ...READING, title: 'Portfolio rules' },
  editorial: READING,
  datastory: DATA_STORY,
  report: DATA_STORY,
  marketing: SHOWCASE,
  event: SHOWCASE,
  presentation: SHOWCASE,
  app: WEB_APP,
  internal: WEB_APP,
  mobile: WEB_APP,
  other: WEB_APP,
};

const WIDTH = {
  narrow: 'Narrow content column, about 560px',
  medium: 'Medium content column, about 680px',
  wide: 'Wide content column, about 880px',
};

const FIELD = {
  outlined: 'Outlined form fields: 1px border, surface background',
  filled: 'Filled form fields: tinted background, no border',
  underline: 'Underlined form fields: bottom border only',
};

const YES_NO = (yes: string, no: string) => ({ yes, no });

/** One sentence for every answer in the project-details step. */
export const ANSWER_RULES: Record<string, Record<string, string>> = {
  chartPalette: {
    'separate-categories': 'Use the categorical palette for most charts',
    'low-to-high': 'Use the sequential palette for most charts',
    'above-and-below-a-midpoint': 'Use the diverging palette for most charts, centred on the midpoint',
  },
  numberFormat: {
    'abbreviated-1-2k': 'Abbreviate in cards (1.2K), full values in tables',
    'full-1-204': 'Show full values everywhere (1,204)',
  },
  tableDensity: { compact: 'Compact table rows, about 32px', comfortable: 'Comfortable table rows, about 44px' },
  nav: {
    sidebar: 'Left sidebar navigation, 240px',
    'top-bar': 'Top bar navigation',
    both: 'Top bar for global items, left sidebar for section items',
  },
  controlStyle: {
    sliders: 'Use sliders for inputs, each with a visible value',
    steppers: 'Use steppers for inputs',
    'number-boxes': 'Use number boxes for inputs, with units',
  },
  layoutStyle: {
    'left-with-results-on-the-right': 'Controls on the left, results on the right',
    'along-the-top': 'Controls along the top, results below',
    'in-a-floating-panel': 'Controls in a floating panel over the results',
  },
  outputEmphasis: {
    'a-big-headline-number': 'Lead the output with one big headline number',
    'a-chart': 'Lead the output with a chart',
    both: 'Show a big headline number above a chart',
  },
  showUncertainty: YES_NO('Show uncertainty as ranges and shaded bands', 'Show central estimates only'),
  mapType: {
    'shaded-regions': 'Choropleth: shade regions using the sequential palette, in 5 steps',
    points: 'Point map: size points by value',
    heatmap: 'Heatmap: blur density using the sequential palette',
    'flow-lines': 'Flow map: curved lines between places, weighted by value',
    'hexagon-grid': 'Hexbin map: aggregate points into equal hexagons',
  },
  basemap: {
    'minimal-light': 'Minimal light basemap with no labels competing with the data',
    'minimal-dark': 'Minimal dark basemap with no labels competing with the data',
    'nothing-shapes-only': 'No basemap: shapes only, on the page background',
  },
  legendPosition: {
    'bottom-left': 'Legend bottom left',
    'bottom-right': 'Legend bottom right',
    'top-right': 'Legend top right',
  },
  sidePanel: YES_NO('Side panel for details on the selected place', 'No side panel; use tooltips for details'),
  readingWidth: WIDTH,
  contentWidth: WIDTH,
  chartAnnotation: {
    callouts: 'Annotate charts with short callouts on the moments that matter',
    minimal: 'Keep chart annotation minimal: a clear title and axis labels',
  },
  sectionTransitions: {
    'as-you-scroll': 'Reveal sections as you scroll, and never hide content from anyone with reduced motion',
    static: 'No scroll effects; sections are static',
  },
  formStyle: FIELD,
  inputStyle: FIELD,
  emptyStates: {
    'an-illustration': 'Empty states: a simple line illustration, one sentence and an action',
    'just-text': 'Empty states: one sentence and an action, no illustration',
  },
  tableStyle: {
    'lines-between-rows': 'Tables: hairline rules between rows',
    'striped-rows': 'Tables: alternating row backgrounds',
    minimal: 'Tables: no rules, spacing only',
  },
  messageStyle: { bubbles: 'Messages as bubbles', 'flat-transcript': 'Messages as a flat transcript, with sender labels' },
  inputPosition: { 'fixed-at-the-bottom': 'Message box fixed at the bottom', centred: 'Message box centred until the first message' },
  sourcesPanel: YES_NO('Show a sources panel beside the conversation', 'No sources panel'),
  formFlow: { 'one-at-a-time': 'One question per screen', 'all-on-one-page': 'All questions on one long page' },
  progressStyle: {
    'a-bar': 'Show progress as a bar',
    'numbered-steps': 'Show progress as numbered steps',
    'not-at-all': 'No progress indicator',
  },
  resultPlacement: {
    'beside-the-inputs': 'Result beside the inputs',
    'below-the-inputs': 'Result below the inputs',
    'fixed-in-view': 'Result stays fixed in view while scrolling',
  },
  updateMode: { 'as-you-type': 'Update the result as you type', 'with-a-calculate-button': 'Update the result with a Calculate button' },
  showBreakdown: YES_NO('Show how the result was worked out', 'Show the result only'),
  heroStyle: {
    'big-headline': 'Hero leads with a big headline',
    'headline-and-image': 'Hero pairs the headline with an image',
    'product-shot': 'Hero leads with a large product shot under the headline',
  },
  sectionRhythm: {
    'even-and-steady': 'Even section rhythm, with consistent spacing',
    alternating: 'Alternating sections, left then right',
    'big-full-width-moments': 'Punctuate the page with big full-width moments',
  },
  buttonStyle: { solid: 'Solid buttons', outlined: 'Outlined buttons', 'text-with-arrow': 'Text buttons with an arrow' },
  productCard: {
    'big-image': 'Product cards lead with a big image',
    'image-and-details': 'Product cards show the image and key details',
    'compact-list': 'Products as a compact list',
  },
  gridDensity: { two: 'Two products in a row', three: 'Three products in a row', four: 'Four products in a row' },
  priceEmphasis: { bold: 'Make prices bold', quiet: 'Keep prices quiet' },
  imageTreatment: {
    'full-width': 'Images run full width',
    'inside-the-text-column': 'Images stay inside the text column',
    'framed-with-a-border': 'Images framed with a 1px border and padding',
  },
  codeTheme: { light: 'Light code blocks', dark: 'Dark code blocks', 'match-the-page': 'Code blocks match the page theme' },
  learningFlow: { 'step-by-step': 'Move step by step, one idea at a time', 'free-exploration': 'Let people explore freely' },
  checkIns: {
    'short-quizzes': 'Check understanding with short quizzes',
    'reflection-prompts': 'Check understanding with reflection prompts',
    'no-check-ins': 'No check-ins',
  },
  playfulness: { subtle: 'Subtle playfulness', lively: 'Lively playfulness', 'over-the-top': 'Playfulness turned all the way up' },
  intensity: { minimal: 'Minimal sound and motion', moderate: 'Moderate sound and motion', full: 'Full sound and motion' },
};

export function projectRules(config: DesignConfig): { title: string; rules: string[] } {
  const { title, base } = RULE_SETS[config.projectType];
  const answers = Object.entries(config.projectOptions).flatMap(([question, answer]) => {
    const rule = typeof answer === 'string' ? ANSWER_RULES[question]?.[answer] : undefined;
    return rule ? [rule] : [];
  });
  return { title, rules: [...base, ...answers] };
}
