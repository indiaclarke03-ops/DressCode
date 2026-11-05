/** Each option list is the source of its union type and of URL validation. */
export const THEMES = ['light', 'dark', 'tinted', 'vivid'] as const;
export const DENSITIES = ['compact', 'airy', 'oversized'] as const;
export const RADII = ['none', 'sharp', 'soft', 'pill'] as const;
export const DEPTHS = ['flat', 'layered', 'bold', 'borderless'] as const;
export const COLOR_STRATEGIES = ['monochrome', 'mono-accent', 'duotone', 'expressive'] as const;
export const COLOR_USES = ['sparing', 'blocks'] as const;
export const HEADING_STYLES = ['sans', 'serif', 'display', 'mono'] as const;
export const HEADING_CASES = ['sentence', 'uppercase', 'oversized'] as const;
export const TEXTURES = ['none', 'grain', 'dots', 'lines'] as const;
export const MOTIONS = ['still', 'quiet', 'expressive'] as const;
export const LAYOUTS = ['grid', 'editorial', 'bento', 'poster'] as const;
export const NEUTRALS = ['cool', 'warm', 'neutral'] as const;
export const TYPE_SCALES = ['tight', 'balanced', 'dramatic'] as const;
export const CONFIG_MODES = ['fresh', 'restyle'] as const;
export const RESTYLE_SCOPES = ['full', 'retheme', 'gradual'] as const;

export const PROJECT_TYPES = [
  'marketing', 'portfolio', 'editorial', 'docs', 'ecommerce', 'event',
  'app', 'internal', 'chat', 'form', 'calculator', 'mobile',
  'dashboard', 'simulator', 'map', 'datastory', 'report', 'explainer',
  'game', 'presentation', 'other',
] as const;

export type Mode = 'fresh' | 'restyle' | 'tweak';
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type RestyleScope = (typeof RESTYLE_SCOPES)[number];

export interface ExtractedStyles {
  colors: string[];
  fonts: string[];
  radii: string[];
  shadows: string[];
}

export interface RestyleConfig {
  stylingSystem: string;
  extracted?: ExtractedStyles;
  keep: string[];
  scope: RestyleScope;
  gradualTarget?: string;
  /** The brand or logo colour to protect, when that item is kept. */
  keepColor?: string;
  /** old hex -> token name */
  colorMap: Record<string, string>;
}

export interface DesignConfig {
  version: 2;
  mode: Exclude<Mode, 'tweak'>;
  name: string;
  /** The starting look, if one was picked. Empty when building from the basics. */
  direction: string;
  projectType: ProjectType;
  projectTypeOther?: string;
  theme: (typeof THEMES)[number];
  density: (typeof DENSITIES)[number];
  radius: (typeof RADII)[number];
  depth: (typeof DEPTHS)[number];
  colorStrategy: (typeof COLOR_STRATEGIES)[number];
  colorUse: (typeof COLOR_USES)[number];
  headingStyle: (typeof HEADING_STYLES)[number];
  headingCase: (typeof HEADING_CASES)[number];
  texture: (typeof TEXTURES)[number];
  motion: (typeof MOTIONS)[number];
  layout: (typeof LAYOUTS)[number];
  accent: string;
  neutral: (typeof NEUTRALS)[number];
  fontPairingId: string;
  typeScale: (typeof TYPE_SCALES)[number];
  projectOptions: Record<string, string | boolean>;
  avoid: string[];
  restyle?: RestyleConfig;
}

/** The eight This-or-That rounds. */
export type ChoiceKey =
  | 'theme' | 'density' | 'radius' | 'depth' | 'colorStrategy' | 'colorUse'
  | 'headingStyle' | 'headingCase' | 'texture' | 'motion' | 'layout';

export type Choices = Pick<DesignConfig, ChoiceKey>;
