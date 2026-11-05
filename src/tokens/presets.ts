import { createDefaultConfig } from './defaults';
import type { DesignConfig } from './types';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  config: DesignConfig;
}

function preset(
  id: string,
  name: string,
  description: string,
  projectType: DesignConfig['projectType'],
  overrides: Partial<DesignConfig>,
): StylePreset {
  return {
    id,
    name,
    description,
    config: { ...createDefaultConfig('fresh', projectType), name, ...overrides },
  };
}

/** The examples gallery. Every one is a real config people can open and edit. */
export const STYLE_PRESETS: StylePreset[] = [
  preset(
    'quiet-ledger',
    'Quiet Ledger',
    'A calm, dense dashboard where typography does the work.',
    'dashboard',
    { accent: '#1F5C45', neutral: 'warm', projectOptions: { nav: 'sidebar', numberFormat: 'abbreviated-1-2k' } },
  ),
  preset(
    'morning-edition',
    'Morning Edition',
    'A serif publication with room to read and a strong voice.',
    'editorial',
    { accent: '#7A2230', neutral: 'warm', fontPairingId: 'newsreader', typeScale: 'dramatic' },
  ),
  preset(
    'harbour',
    'Harbour',
    'A friendly product with soft corners and gentle depth.',
    'app',
    { accent: '#1E5AA8', neutral: 'cool', fontPairingId: 'manrope' },
  ),
  preset(
    'night-shift',
    'Night Shift',
    'A focused dark assistant for long working sessions.',
    'chat',
    { theme: 'dark', accent: '#7FC8A9', neutral: 'cool', fontPairingId: 'ibm-plex', depth: 'flat' },
  ),
  preset(
    'open-house',
    'Open House',
    'A warm, confident landing page with an editorial rhythm.',
    'marketing',
    { accent: '#B84A26', neutral: 'warm', fontPairingId: 'fraunces', projectOptions: { heroStyle: 'headline-and-image' } },
  ),
  preset(
    'field-guide',
    'Field Guide',
    'A clear, expressive lesson that invites people to explore.',
    'explainer',
    { accent: '#0F6E6E', neutral: 'neutral', fontPairingId: 'dm-sans', colorStrategy: 'expressive' },
  ),
];
