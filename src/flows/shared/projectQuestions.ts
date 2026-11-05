import type { ProjectType } from '@/tokens/types';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface ProjectQuestion {
  id: string;
  label: string;
  options: QuestionOption[];
}

const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ask = (id: string, label: string, options: string[]): ProjectQuestion => ({
  id,
  label,
  options: options.map((option) => ({ id: slug(option), label: option })),
});

const YES_NO = ['Yes', 'No'];

const WEB_APP = [
  ask('nav', 'Where should the main navigation go?', ['Sidebar', 'Top bar', 'Both']),
  ask('formStyle', 'How should form fields look?', ['Outlined', 'Filled', 'Underline']),
  ask('emptyStates', 'What should empty screens show?', ['An illustration', 'Just text']),
  ask('tableStyle', 'How should tables look?', ['Lines between rows', 'Striped rows', 'Minimal']),
];

const SHOWCASE = [
  ask('heroStyle', 'What should the top of the page lead with?', [
    'Big headline',
    'Headline and image',
    'Product shot',
  ]),
  ask('sectionRhythm', 'How should sections flow down the page?', [
    'Even and steady',
    'Alternating',
    'Big full-width moments',
  ]),
  ask('buttonStyle', 'What style of button?', ['Solid', 'Outlined', 'Text with arrow']),
];

const READING_PAGE = [
  ask('contentWidth', 'How wide should the content be?', ['Narrow', 'Medium', 'Wide']),
  ask('imageTreatment', 'How should images sit on the page?', [
    'Full width',
    'Inside the text column',
    'Framed with a border',
  ]),
];

const DATA_STORY = [
  ask('readingWidth', 'How wide should the reading column be?', ['Narrow', 'Medium', 'Wide']),
  ask('chartAnnotation', 'How should charts be annotated?', ['Callouts', 'Minimal']),
  ask('sectionTransitions', 'How should sections appear?', ['As you scroll', 'Static']),
];

export const PROJECT_QUESTIONS: Record<ProjectType, ProjectQuestion[]> = {
  dashboard: [
    ask('chartPalette', 'What will most charts show?', [
      'Separate categories',
      'Low to high',
      'Above and below a midpoint',
    ]),
    ask('numberFormat', 'How should numbers read?', ['Abbreviated (1.2K)', 'Full (1,204)']),
    ask('tableDensity', 'How tight should tables be?', ['Compact', 'Comfortable']),
    ask('nav', 'Where should the main navigation go?', ['Sidebar', 'Top bar']),
  ],
  simulator: [
    ask('controlStyle', 'How should people change inputs?', ['Sliders', 'Steppers', 'Number boxes']),
    ask('layoutStyle', 'Where should the controls sit?', [
      'Left, with results on the right',
      'Along the top',
      'In a floating panel',
    ]),
    ask('outputEmphasis', 'What should the result lead with?', [
      'A big headline number',
      'A chart',
      'Both',
    ]),
    ask('showUncertainty', 'Show uncertainty, like ranges and bands?', YES_NO),
  ],
  map: [
    ask('mapType', 'What kind of map?', [
      'Shaded regions',
      'Points',
      'Heatmap',
      'Flow lines',
      'Hexagon grid',
    ]),
    ask('basemap', 'What should sit behind the data?', [
      'Minimal light',
      'Minimal dark',
      'Nothing, shapes only',
    ]),
    ask('legendPosition', 'Where should the legend go?', [
      'Bottom left',
      'Bottom right',
      'Top right',
    ]),
    ask('sidePanel', 'Add a side panel for details?', YES_NO),
  ],
  datastory: DATA_STORY,
  report: DATA_STORY,
  app: WEB_APP,
  internal: WEB_APP,
  mobile: WEB_APP,
  other: WEB_APP,
  chat: [
    ask('messageStyle', 'How should messages look?', ['Bubbles', 'Flat transcript']),
    ask('inputPosition', 'Where should the message box go?', ['Fixed at the bottom', 'Centred']),
    ask('sourcesPanel', 'Show a sources panel?', YES_NO),
  ],
  form: [
    ask('formFlow', 'How should the questions appear?', ['One at a time', 'All on one page']),
    ask('progressStyle', 'How should progress show?', ['A bar', 'Numbered steps', 'Not at all']),
    ask('inputStyle', 'How should inputs look?', ['Outlined', 'Filled', 'Underline']),
  ],
  calculator: [
    ask('resultPlacement', 'Where should the result go?', [
      'Beside the inputs',
      'Below the inputs',
      'Fixed in view',
    ]),
    ask('updateMode', 'When should the result update?', ['As you type', 'With a Calculate button']),
    ask('showBreakdown', 'Show how the result was worked out?', YES_NO),
  ],
  marketing: SHOWCASE,
  event: SHOWCASE,
  presentation: SHOWCASE,
  ecommerce: [
    ask('productCard', 'What should product cards lead with?', [
      'Big image',
      'Image and details',
      'Compact list',
    ]),
    ask('gridDensity', 'How many products in a row?', ['Two', 'Three', 'Four']),
    ask('priceEmphasis', 'How prominent should prices be?', ['Bold', 'Quiet']),
  ],
  portfolio: READING_PAGE,
  editorial: READING_PAGE,
  docs: [
    ...READING_PAGE,
    ask('codeTheme', 'What colour should code blocks be?', ['Light', 'Dark', 'Match the page']),
  ],
  explainer: [
    ask('learningFlow', 'How should people move through it?', [
      'Step by step',
      'Free exploration',
    ]),
    ask('checkIns', 'How should it check understanding?', [
      'Short quizzes',
      'Reflection prompts',
      'No check-ins',
    ]),
  ],
  game: [
    ask('playfulness', 'How playful should it feel?', ['Subtle', 'Lively', 'Over the top']),
    ask('intensity', 'How much sound and motion?', ['Minimal', 'Moderate', 'Full']),
  ],
};
