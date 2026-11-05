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
const code = (family: string, weight: number): FontRole => ({ family, weight, fallback: MONO });

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
  {
    id: 'dm-serif',
    name: 'DM Serif Display + DM Sans',
    style: 'serif',
    heading: serif('DM Serif Display', 400),
    body: sans('DM Sans', 400),
    mono: mono('DM Mono'),
  },
  {
    id: 'bodoni',
    name: 'Bodoni Moda + Jost',
    style: 'serif',
    heading: serif('Bodoni Moda', 600),
    body: sans('Jost', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond + Mulish',
    style: 'serif',
    heading: serif('Cormorant Garamond', 600),
    body: sans('Mulish', 400),
    mono: mono('DM Mono'),
  },
  {
    id: 'zilla',
    name: 'Zilla Slab + Inter',
    style: 'serif',
    heading: serif('Zilla Slab', 600),
    body: sans('Inter', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque + Inter',
    style: 'display',
    heading: sans('Bricolage Grotesque', 700),
    body: sans('Inter', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'anton',
    name: 'Anton + Work Sans',
    style: 'display',
    heading: sans('Anton', 400),
    body: sans('Work Sans', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'unbounded',
    name: 'Unbounded + Manrope',
    style: 'display',
    heading: sans('Unbounded', 700),
    body: sans('Manrope', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'syne',
    name: 'Syne + Inter',
    style: 'display',
    heading: sans('Syne', 700),
    body: sans('Inter', 400),
    mono: mono('Space Mono'),
  },
  {
    id: 'archivo',
    name: 'Archivo Black + Archivo',
    style: 'display',
    heading: sans('Archivo Black', 400),
    body: sans('Archivo', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'fredoka',
    name: 'Fredoka + Nunito',
    style: 'display',
    heading: sans('Fredoka', 600),
    body: sans('Nunito', 400),
    mono: mono('DM Mono'),
  },
  {
    id: 'abril',
    name: 'Abril Fatface + Lato',
    style: 'display',
    heading: serif('Abril Fatface', 400),
    body: sans('Lato', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'space-mono',
    name: 'Space Mono + Space Grotesk',
    style: 'mono',
    heading: code('Space Mono', 700),
    body: sans('Space Grotesk', 400),
    mono: mono('Space Mono'),
  },
  {
    id: 'plex-mono',
    name: 'IBM Plex Mono + IBM Plex Sans',
    style: 'mono',
    heading: code('IBM Plex Mono', 600),
    body: sans('IBM Plex Sans', 400),
    mono: mono('IBM Plex Mono'),
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    style: 'mono',
    heading: code('JetBrains Mono', 700),
    body: code('JetBrains Mono', 400),
    mono: mono('JetBrains Mono'),
  },
  {
    id: 'vt323',
    name: 'VT323 + IBM Plex Mono',
    style: 'mono',
    heading: code('VT323', 400),
    body: code('IBM Plex Mono', 400),
    mono: mono('VT323'),
  },
];

const FALLBACK_BY_STYLE: Record<DesignConfig['headingStyle'], string> = {
  sans: 'geist',
  serif: 'instrument',
  display: 'bricolage',
  mono: 'space-mono',
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
