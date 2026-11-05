import type { Choices, DesignConfig, ProjectType } from './types';

export interface StyleDirection {
  id: string;
  name: string;
  description: string;
  /** The project this look is shown on in the examples gallery. */
  exampleProject: ProjectType;
  accent: string;
  neutral: DesignConfig['neutral'];
  fontPairingId: string;
  typeScale: DesignConfig['typeScale'];
  choices: Choices;
}

/** Deliberately far apart. Each one should be unmistakable next to the others. */
export const STYLE_DIRECTIONS: StyleDirection[] = [
  {
    id: 'quiet-ledger',
    name: 'Quiet Ledger',
    description: 'Calm and precise. Hairlines, one green accent, nothing shouting.',
    exampleProject: 'dashboard',
    accent: '#1F5C45',
    neutral: 'warm',
    fontPairingId: 'geist',
    typeScale: 'tight',
    choices: {
      theme: 'light', density: 'compact', radius: 'sharp', depth: 'flat',
      colorStrategy: 'mono-accent', colorUse: 'sparing', headingStyle: 'sans',
      headingCase: 'sentence', texture: 'none', motion: 'quiet', layout: 'grid',
    },
  },
  {
    id: 'broadsheet',
    name: 'Broadsheet',
    description: 'A serious newspaper. Black ink, heavy rules, no colour at all.',
    exampleProject: 'editorial',
    accent: '#1A1A1A',
    neutral: 'warm',
    fontPairingId: 'playfair',
    typeScale: 'dramatic',
    choices: {
      theme: 'light', density: 'compact', radius: 'none', depth: 'flat',
      colorStrategy: 'monochrome', colorUse: 'sparing', headingStyle: 'serif',
      headingCase: 'oversized', texture: 'grain', motion: 'still', layout: 'editorial',
    },
  },
  {
    id: 'pop-riot',
    name: 'Pop Riot',
    description: 'Loud neo-brutalism. Thick outlines, hard shadows, clashing colour.',
    exampleProject: 'marketing',
    accent: '#E6287A',
    neutral: 'neutral',
    fontPairingId: 'archivo',
    typeScale: 'dramatic',
    choices: {
      theme: 'tinted', density: 'airy', radius: 'none', depth: 'bold',
      colorStrategy: 'expressive', colorUse: 'blocks', headingStyle: 'display',
      headingCase: 'uppercase', texture: 'dots', motion: 'expressive', layout: 'bento',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'A hacker console. Mono type, green on black, sharp edges.',
    exampleProject: 'chat',
    accent: '#3FCF9B',
    neutral: 'neutral',
    fontPairingId: 'jetbrains',
    typeScale: 'tight',
    choices: {
      theme: 'dark', density: 'compact', radius: 'none', depth: 'flat',
      colorStrategy: 'mono-accent', colorUse: 'sparing', headingStyle: 'mono',
      headingCase: 'sentence', texture: 'lines', motion: 'still', layout: 'grid',
    },
  },
  {
    id: 'velvet-room',
    name: 'Velvet Room',
    description: 'Hushed luxury. Deep oxblood, elegant serifs, wide open space.',
    exampleProject: 'ecommerce',
    accent: '#7A2230',
    neutral: 'warm',
    fontPairingId: 'bodoni',
    typeScale: 'dramatic',
    choices: {
      theme: 'vivid', density: 'oversized', radius: 'none', depth: 'borderless',
      colorStrategy: 'mono-accent', colorUse: 'sparing', headingStyle: 'serif',
      headingCase: 'uppercase', texture: 'none', motion: 'quiet', layout: 'editorial',
    },
  },
  {
    id: 'playground',
    name: 'Playground',
    description: 'Round, bouncy and friendly. Big pills in bright, happy colour.',
    exampleProject: 'explainer',
    accent: '#0E8F8F',
    neutral: 'neutral',
    fontPairingId: 'fredoka',
    typeScale: 'balanced',
    choices: {
      theme: 'tinted', density: 'oversized', radius: 'pill', depth: 'layered',
      colorStrategy: 'expressive', colorUse: 'blocks', headingStyle: 'display',
      headingCase: 'sentence', texture: 'none', motion: 'expressive', layout: 'bento',
    },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drawing. White lines on electric blue, on a dot grid.',
    exampleProject: 'simulator',
    accent: '#0057E7',
    neutral: 'cool',
    fontPairingId: 'space-mono',
    typeScale: 'tight',
    choices: {
      theme: 'vivid', density: 'compact', radius: 'none', depth: 'flat',
      colorStrategy: 'mono-accent', colorUse: 'sparing', headingStyle: 'mono',
      headingCase: 'uppercase', texture: 'dots', motion: 'quiet', layout: 'grid',
    },
  },
  {
    id: 'swiss-poster',
    name: 'Swiss Poster',
    description: 'Bold modernism. Giant type, signal red, strict and confident.',
    exampleProject: 'event',
    accent: '#E5261F',
    neutral: 'neutral',
    fontPairingId: 'anton',
    typeScale: 'dramatic',
    choices: {
      theme: 'light', density: 'airy', radius: 'none', depth: 'borderless',
      colorStrategy: 'duotone', colorUse: 'blocks', headingStyle: 'display',
      headingCase: 'uppercase', texture: 'none', motion: 'quiet', layout: 'poster',
    },
  },
  {
    id: 'sunday-supplement',
    name: 'Sunday Supplement',
    description: 'A warm lifestyle magazine. Soft peach, big serifs, slow pace.',
    exampleProject: 'portfolio',
    accent: '#D9482B',
    neutral: 'warm',
    fontPairingId: 'cormorant',
    typeScale: 'dramatic',
    choices: {
      theme: 'tinted', density: 'oversized', radius: 'soft', depth: 'borderless',
      colorStrategy: 'duotone', colorUse: 'sparing', headingStyle: 'serif',
      headingCase: 'oversized', texture: 'grain', motion: 'quiet', layout: 'editorial',
    },
  },
  {
    id: 'harbour',
    name: 'Harbour',
    description: 'A friendly modern product. Soft cards, gentle depth, clear blue.',
    exampleProject: 'app',
    accent: '#1E5AA8',
    neutral: 'cool',
    fontPairingId: 'manrope',
    typeScale: 'balanced',
    choices: {
      theme: 'light', density: 'airy', radius: 'soft', depth: 'layered',
      colorStrategy: 'mono-accent', colorUse: 'blocks', headingStyle: 'sans',
      headingCase: 'sentence', texture: 'none', motion: 'quiet', layout: 'grid',
    },
  },
  {
    id: 'arcade',
    name: 'Arcade',
    description: 'Pixel type and neon on deep magenta. Press start.',
    exampleProject: 'game',
    accent: '#C2187D',
    neutral: 'neutral',
    fontPairingId: 'vt323',
    typeScale: 'dramatic',
    choices: {
      theme: 'vivid', density: 'airy', radius: 'none', depth: 'bold',
      colorStrategy: 'expressive', colorUse: 'sparing', headingStyle: 'mono',
      headingCase: 'uppercase', texture: 'lines', motion: 'expressive', layout: 'bento',
    },
  },
  {
    id: 'field-notes',
    name: 'Field Notes',
    description: 'A naturalist notebook. Moss green paper, slab type, ruled lines.',
    exampleProject: 'report',
    accent: '#5B6B2E',
    neutral: 'warm',
    fontPairingId: 'zilla',
    typeScale: 'balanced',
    choices: {
      theme: 'tinted', density: 'airy', radius: 'sharp', depth: 'flat',
      colorStrategy: 'duotone', colorUse: 'sparing', headingStyle: 'serif',
      headingCase: 'sentence', texture: 'lines', motion: 'still', layout: 'editorial',
    },
  },
];

export function findDirection(id: string): StyleDirection | undefined {
  return STYLE_DIRECTIONS.find((direction) => direction.id === id);
}
