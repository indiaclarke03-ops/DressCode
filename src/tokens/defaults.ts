import { defaultPairingId } from './fontPairings';
import type { Choices, DesignConfig, ProjectType, RestyleConfig } from './types';

/** Ten curated accents. Deliberately no default purple or indigo. */
export const ACCENT_SWATCHES = [
  { name: 'Deep green', hex: '#1F5C45' },
  { name: 'Ink blue', hex: '#1F3A5F' },
  { name: 'Terracotta', hex: '#B84A26' },
  { name: 'Ochre', hex: '#A8701A' },
  { name: 'Teal', hex: '#0F6E6E' },
  { name: 'Oxblood', hex: '#7A2230' },
  { name: 'Moss', hex: '#5B6B2E' },
  { name: 'Cobalt', hex: '#1E5AA8' },
  { name: 'Clay rose', hex: '#A8485A' },
  { name: 'Graphite', hex: '#3A3A36' },
] as const;

export const DEFAULT_ACCENT = ACCENT_SWATCHES[0].hex;

export const AVOID_ITEMS = [
  { id: 'gradients', label: 'Purple-to-blue or rainbow gradients' },
  { id: 'emoji-icons', label: 'Emoji used as icons' },
  { id: 'three-cards', label: 'Three identical feature cards in a row' },
  { id: 'centre-aligned', label: 'Everything centre-aligned' },
  { id: 'glassmorphism', label: 'Glassmorphism / heavy blur' },
  { id: 'oversized-radius', label: 'Oversized border radius on everything' },
  { id: 'stock-heroes', label: 'Generic stock-style hero illustrations' },
  { id: 'shadows-everywhere', label: 'Drop shadows on every element' },
  { id: 'placeholder-copy', label: 'Placeholder copy ("Lorem ipsum", "Welcome to our platform")' },
  { id: 'font-sprawl', label: 'Too many font weights and sizes' },
  { id: 'grey-on-grey', label: 'Low-contrast grey text on grey backgrounds' },
  { id: 'load-animations', label: 'Decorative animations on load' },
  { id: 'rainbow-charts', label: 'Rainbow chart palettes / default library chart colours' },
  { id: 'loud-basemaps', label: 'Maps with full-colour default basemaps that compete with the data' },
] as const;

export const KEEP_ITEMS = [
  { id: 'layout', label: 'Layout and page structure' },
  { id: 'copy', label: 'All copy/text' },
  { id: 'components', label: 'Component library (e.g. keep shadcn, just re-theme it)' },
  { id: 'brand-colour', label: 'Brand/logo colour' },
  { id: 'icons', label: 'Icons' },
  { id: 'functionality', label: 'Functionality and behaviour' },
] as const;

/** Always kept: "We never change what your app does". */
export const LOCKED_KEEP_ITEM = 'functionality';

const BASE_CHOICES: Choices = {
  theme: 'light',
  density: 'airy',
  radius: 'sharp',
  depth: 'flat',
  colorStrategy: 'mono-accent',
  headingStyle: 'sans',
  motion: 'quiet',
  layout: 'grid',
};

const DATA_TOOL: Partial<Choices> = { density: 'compact' };
const PRODUCT: Partial<Choices> = { radius: 'soft', depth: 'layered' };
const LONG_READ: Partial<Choices> = { headingStyle: 'serif', layout: 'editorial' };
const SHOWPIECE: Partial<Choices> = { radius: 'soft', motion: 'expressive', layout: 'editorial' };

/** What "No preference" means for each project type. */
const PROJECT_CHOICES: Record<ProjectType, Partial<Choices>> = {
  marketing: { ...SHOWPIECE, headingStyle: 'serif' },
  portfolio: LONG_READ,
  editorial: LONG_READ,
  docs: {},
  ecommerce: PRODUCT,
  event: { ...SHOWPIECE, colorStrategy: 'expressive' },
  app: PRODUCT,
  internal: DATA_TOOL,
  chat: { radius: 'soft' },
  form: { radius: 'soft' },
  calculator: PRODUCT,
  mobile: PRODUCT,
  dashboard: DATA_TOOL,
  simulator: DATA_TOOL,
  map: DATA_TOOL,
  datastory: { ...LONG_READ, colorStrategy: 'expressive' },
  report: LONG_READ,
  explainer: { ...SHOWPIECE, layout: 'grid' },
  game: { ...SHOWPIECE, theme: 'dark', colorStrategy: 'expressive' },
  presentation: { ...LONG_READ, theme: 'dark', motion: 'expressive' },
  other: PRODUCT,
};

export function choicesFor(projectType: ProjectType): Choices {
  return { ...BASE_CHOICES, ...PROJECT_CHOICES[projectType] };
}

export function createRestyleConfig(): RestyleConfig {
  return {
    stylingSystem: 'unknown',
    keep: [LOCKED_KEEP_ITEM],
    scope: 'retheme',
    colorMap: {},
  };
}

export function createDefaultConfig(
  mode: DesignConfig['mode'] = 'fresh',
  projectType: ProjectType = 'app',
): DesignConfig {
  const choices = choicesFor(projectType);
  return {
    version: 2,
    mode,
    name: '',
    projectType,
    ...choices,
    accent: DEFAULT_ACCENT,
    neutral: 'warm',
    fontPairingId: defaultPairingId(choices.headingStyle),
    typeScale: 'balanced',
    projectOptions: {},
    avoid: AVOID_ITEMS.map((item) => item.id),
    ...(mode === 'restyle' ? { restyle: createRestyleConfig() } : {}),
  };
}

/** The scene family a project type previews as. */
export type SceneFamily =
  | 'dashboard' | 'simulator' | 'map' | 'app' | 'chat' | 'marketing' | 'editorial' | 'docs';

export const SCENE_FOR_PROJECT: Record<ProjectType, SceneFamily> = {
  dashboard: 'dashboard',
  internal: 'dashboard',
  simulator: 'simulator',
  calculator: 'simulator',
  map: 'map',
  app: 'app',
  mobile: 'app',
  form: 'app',
  other: 'app',
  chat: 'chat',
  marketing: 'marketing',
  event: 'marketing',
  ecommerce: 'marketing',
  presentation: 'marketing',
  game: 'marketing',
  editorial: 'editorial',
  datastory: 'editorial',
  report: 'editorial',
  explainer: 'editorial',
  docs: 'docs',
  portfolio: 'docs',
};
