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
  a: RoundOption;
  b: RoundOption;
}

export const ROUNDS: Round[] = [
  {
    key: 'theme',
    title: 'Light or dark?',
    explanation: 'Sets the mood, and how your project reads in different lighting.',
    a: { value: 'light', label: 'Light' },
    b: { value: 'dark', label: 'Dark' },
  },
  {
    key: 'density',
    title: 'Airy or compact?',
    explanation: 'Airy gives things room to breathe. Compact fits more on screen.',
    a: { value: 'airy', label: 'Airy' },
    b: { value: 'compact', label: 'Compact' },
  },
  {
    key: 'radius',
    title: 'Sharp or soft corners?',
    explanation: 'Sharp feels precise and serious. Soft feels friendly and approachable.',
    a: { value: 'sharp', label: 'Sharp' },
    b: { value: 'soft', label: 'Soft' },
  },
  {
    key: 'depth',
    title: 'Flat or layered?',
    explanation: 'Flat separates things with thin lines. Layered lifts them with soft shadows.',
    a: { value: 'flat', label: 'Flat' },
    b: { value: 'layered', label: 'Layered' },
  },
  {
    key: 'colorStrategy',
    title: 'One colour or many?',
    explanation: 'One main colour stays calm and focused. Several feel expressive and lively.',
    a: { value: 'mono-accent', label: 'One main colour' },
    b: { value: 'expressive', label: 'Multi-colour' },
  },
  {
    key: 'headingStyle',
    title: 'Sans-serif or serif headings?',
    explanation: 'Sans-serif reads as modern and neutral. Serif feels editorial and considered.',
    a: { value: 'sans', label: 'Sans-serif' },
    b: { value: 'serif', label: 'Serif' },
  },
  {
    key: 'motion',
    title: 'Quiet or expressive motion?',
    explanation: 'Quiet motion stays out of the way. Expressive motion adds bounce and rhythm.',
    a: { value: 'quiet', label: 'Quiet' },
    b: { value: 'expressive', label: 'Expressive' },
  },
  {
    key: 'layout',
    title: 'Strict grid or editorial?',
    explanation: 'A grid keeps everything lined up. Editorial uses asymmetry for a magazine feel.',
    a: { value: 'grid', label: 'Strict grid' },
    b: { value: 'editorial', label: 'Editorial' },
  },
];
