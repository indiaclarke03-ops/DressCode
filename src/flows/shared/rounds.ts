import type { ChoiceKey } from '@/tokens/types';

export interface RoundOption {
  value: string;
  label: string;
}

export interface Round {
  key: ChoiceKey;
  title: string;
  /** The one-line explanation shown with each round. */
  explanation: string;
  options: RoundOption[];
}

export const ROUNDS: Round[] = [
  {
    key: 'theme',
    title: 'What should the page be?',
    explanation: 'The biggest single decision. A coloured page feels nothing like a white one.',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'tinted', label: 'Tinted' },
      { value: 'vivid', label: 'Colour-drenched' },
    ],
  },
  {
    key: 'density',
    title: 'How much room?',
    explanation: 'Compact fits more on screen. Oversized feels bold and unhurried.',
    options: [
      { value: 'compact', label: 'Compact' },
      { value: 'airy', label: 'Comfortable' },
      { value: 'oversized', label: 'Oversized' },
    ],
  },
  {
    key: 'radius',
    title: 'What shape are the corners?',
    explanation: 'Square feels graphic and strict. Pills feel friendly and playful.',
    options: [
      { value: 'none', label: 'Square' },
      { value: 'sharp', label: 'Slight' },
      { value: 'soft', label: 'Soft' },
      { value: 'pill', label: 'Pill' },
    ],
  },
  {
    key: 'depth',
    title: 'How do things stand apart?',
    explanation: 'Thin lines stay quiet. Thick outlines and hard shadows make a statement.',
    options: [
      { value: 'flat', label: 'Thin lines' },
      { value: 'layered', label: 'Soft shadows' },
      { value: 'bold', label: 'Bold outlines' },
      { value: 'borderless', label: 'Tone only' },
    ],
  },
  {
    key: 'colorStrategy',
    title: 'How many colours?',
    explanation: 'Fewer feels focused and confident. More feels energetic and expressive.',
    options: [
      { value: 'monochrome', label: 'Black and white' },
      { value: 'mono-accent', label: 'One main colour' },
      { value: 'duotone', label: 'Two colours' },
      { value: 'expressive', label: 'Multi-colour' },
    ],
  },
  {
    key: 'colorUse',
    title: 'How boldly should colour be used?',
    explanation: 'A touch keeps it for key moments. Blocks fill headers and panels with it.',
    options: [
      { value: 'sparing', label: 'Just a touch' },
      { value: 'blocks', label: 'Big colour blocks' },
    ],
  },
  {
    key: 'headingStyle',
    title: 'What voice should headings have?',
    explanation: 'Neutral, editorial, loud or technical. Headings set the personality.',
    options: [
      { value: 'sans', label: 'Sans-serif' },
      { value: 'serif', label: 'Serif' },
      { value: 'display', label: 'Display' },
      { value: 'mono', label: 'Mono' },
    ],
  },
  {
    key: 'headingCase',
    title: 'How loud are the headings?',
    explanation: 'Capitals feel like signage. Oversized headings dominate the page.',
    options: [
      { value: 'sentence', label: 'Normal' },
      { value: 'uppercase', label: 'Capitals' },
      { value: 'oversized', label: 'Oversized' },
    ],
  },
  {
    key: 'texture',
    title: 'Any texture behind the page?',
    explanation: 'A little texture adds character. Plain keeps things clean.',
    options: [
      { value: 'none', label: 'Plain' },
      { value: 'grain', label: 'Paper grain' },
      { value: 'dots', label: 'Dot grid' },
      { value: 'lines', label: 'Ruled lines' },
    ],
  },
  {
    key: 'motion',
    title: 'How should it move?',
    explanation: 'Quiet motion stays out of the way. Expressive motion adds bounce and rhythm.',
    options: [
      { value: 'still', label: 'Not at all' },
      { value: 'quiet', label: 'Quietly' },
      { value: 'expressive', label: 'Expressively' },
    ],
  },
  {
    key: 'layout',
    title: 'How should pages be arranged?',
    explanation: 'From a strict grid to one huge idea per screen.',
    options: [
      { value: 'grid', label: 'Strict grid' },
      { value: 'editorial', label: 'Editorial' },
      { value: 'bento', label: 'Bento tiles' },
      { value: 'poster', label: 'Poster' },
    ],
  },
];
