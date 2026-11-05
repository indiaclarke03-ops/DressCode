import type { DesignConfig } from './types';

export interface FontRole {
  family: string;
  weight: number;
  /** CSS fallback stack. */
  fallback: string;
}

export interface FontPairing {
  id: string;
  name: string;
  style: DesignConfig['headingStyle'];
  heading: FontRole;
  body: FontRole;
  mono: FontRole;
}

const SANS = 'ui-sans-serif, system-ui, sans-serif';
const SERIF = 'Georgia, serif';
const MONO = 'ui-monospace, Menlo, monospace';

const sans = (family: string, weight: number): FontRole => ({ family, weight, fallback: SANS });
const serif = (family: string, weight: number): FontRole => ({ family, weight, fallback: SERIF });
const mono = (family: string): FontRole => ({ family, weight: 400, fallback: MONO });

/** Every family here was confirmed on Google Fonts. */
export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'geist',
    name: 'Geist + Geist Mono',
    style: 'sans',
    heading: sans('Geist', 600),
    body: sans('Geist', 400),
    mono: mono('Geist Mono'),
  },
  {
    id: 'inter-tight',
    name: 'Inter Tight + Inter',
    style: 'sans',
    heading: sans('Inter Tight', 600),
    body: sans('Inter', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'manrope',
    name: 'Manrope',
    style: 'sans',
    heading: sans('Manrope', 700),
    body: sans('Manrope', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'ibm-plex',
    name: 'IBM Plex Sans + IBM Plex Mono',
    style: 'sans',
    heading: sans('IBM Plex Sans', 600),
    body: sans('IBM Plex Sans', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    style: 'sans',
    heading: sans('DM Sans', 600),
    body: sans('DM Sans', 400),
    mono: mono('DM Mono'),
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk + Inter',
    style: 'sans',
    heading: sans('Space Grotesk', 600),
    body: sans('Inter', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'instrument',
    name: 'Instrument Serif + Geist',
    style: 'serif',
    heading: serif('Instrument Serif', 400),
    body: sans('Geist', 400),
    mono: mono('Geist Mono'),
  },
  {
    id: 'fraunces',
    name: 'Fraunces + Inter',
    style: 'serif',
    heading: serif('Fraunces', 600),
    body: sans('Inter', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'newsreader',
    name: 'Newsreader + Source Sans 3',
    style: 'serif',
    heading: serif('Newsreader', 500),
    body: sans('Source Sans 3', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'playfair',
    name: 'Playfair Display + Lato',
    style: 'serif',
    heading: serif('Playfair Display', 600),
    body: sans('Lato', 400),
    mono: mono('IBM Plex Mono'),
  },
];

const FALLBACK_BY_STYLE: Record<DesignConfig['headingStyle'], string> = {
  sans: 'geist',
  serif: 'instrument',
};

export function defaultPairingId(style: DesignConfig['headingStyle']): string {
  return FALLBACK_BY_STYLE[style];
}

export function findPairing(id: string): FontPairing | undefined {
  return FONT_PAIRINGS.find((pairing) => pairing.id === id);
}

export function getPairing(id: string): FontPairing {
  const pairing = findPairing(id) ?? FONT_PAIRINGS[0];
  if (!pairing) throw new Error('No font pairings defined');
  return pairing;
}
