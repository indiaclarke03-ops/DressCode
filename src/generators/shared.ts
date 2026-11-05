import { toLch } from '@/tokens/color';
import { AVOID_ITEMS } from '@/tokens/defaults';
import type { DesignConfig, ProjectType } from '@/tokens/types';

export const PROJECT_LABELS: Record<ProjectType, string> = {
  marketing: 'Marketing / landing page',
  portfolio: 'Portfolio / personal site',
  editorial: 'Blog / editorial / publication',
  docs: 'Docs / knowledge base',
  ecommerce: 'E-commerce / storefront',
  event: 'Event / conference site',
  app: 'Web app / SaaS product',
  internal: 'Internal tool / admin panel',
  chat: 'AI chat / assistant interface',
  form: 'Form / survey / questionnaire',
  calculator: 'Calculator / estimator',
  mobile: 'Mobile-first web app',
  dashboard: 'Data dashboard',
  simulator: 'Simulator / scenario model',
  map: 'Map-based tool / geospatial explorer',
  datastory: 'Interactive data story',
  report: 'Research report / policy brief',
  explainer: 'Educational explainer / interactive lesson',
  game: 'Game / playful interactive',
  presentation: 'Presentation-style microsite',
  other: 'Web app',
};

const PROJECT_NOUNS: Record<ProjectType, string> = {
  marketing: 'landing page',
  portfolio: 'portfolio',
  editorial: 'publication',
  docs: 'documentation site',
  ecommerce: 'storefront',
  event: 'event site',
  app: 'web app',
  internal: 'internal tool',
  chat: 'chat assistant',
  form: 'form',
  calculator: 'calculator',
  mobile: 'mobile web app',
  dashboard: 'dashboard',
  simulator: 'simulator',
  map: 'map explorer',
  datastory: 'data story',
  report: 'report',
  explainer: 'interactive lesson',
  game: 'game',
  presentation: 'presentation microsite',
  other: 'web app',
};

export function projectLabel(config: DesignConfig): string {
  const other = config.projectTypeOther?.trim();
  return config.projectType === 'other' && other ? other : PROJECT_LABELS[config.projectType];
}

export function projectNoun(config: DesignConfig): string {
  const other = config.projectTypeOther?.trim();
  return config.projectType === 'other' && other ? other : PROJECT_NOUNS[config.projectType];
}

const TITLE_WORD = { quiet: 'Quiet', expressive: 'Lively' };

/** The chosen name, or a sensible one built from the choices. */
export function styleTitle(config: DesignConfig): string {
  const name = config.name.trim();
  if (name) return name;
  const noun = PROJECT_NOUNS[config.projectType].split(' ').at(-1) ?? 'style';
  return `${TITLE_WORD[config.motion]} ${noun[0]?.toUpperCase()}${noun.slice(1)}`;
}

export function styleSlug(config: DesignConfig): string {
  const slug = styleTitle(config)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'custom-style';
}

const HUE_NAMES: [number, string][] = [
  [20, 'red'],
  [50, 'terracotta'],
  [85, 'ochre'],
  [115, 'olive'],
  [165, 'green'],
  [215, 'teal'],
  [265, 'blue'],
  [320, 'violet'],
  [360, 'rose'],
];

/** "Deep green" rather than a hex, for prose. */
export function describeColour(hex: string): string {
  const { l, c, h } = toLch(hex);
  if (c < 0.03) return l < 0.45 ? 'graphite' : 'grey';
  const hue = HUE_NAMES.find(([limit]) => h < limit)?.[1] ?? 'red';
  if (l < 0.45) return `deep ${hue}`;
  return l > 0.75 ? `pale ${hue}` : hue;
}

const MAP_PROJECTS: ProjectType[] = ['map', 'datastory', 'report'];

/** Turns stored avoid entries into "Do not" lines. Custom entries pass through. */
export function doNotLines(config: DesignConfig): string[] {
  const relevant = config.avoid.filter(
    (entry) => entry !== 'loud-basemaps' || MAP_PROJECTS.includes(config.projectType),
  );
  return relevant.map((entry) => {
    const item = AVOID_ITEMS.find((candidate) => candidate.id === entry);
    return item ? item.rule : entry;
  });
}

export const BEFORE_YOU_FINISH = [
  'Run the app and screenshot each new or changed screen at 1440px and 390px wide.',
  'Check every screen against this brief, especially "Do not".',
  'Check text contrast meets WCAG AA.',
  "Fix anything that doesn't match, then screenshot again.",
];

export function beforeYouFinish(): string {
  return ['## Before you finish', ...BEFORE_YOU_FINISH.map((line, i) => `${i + 1}. ${line}`)].join('\n');
}

/** For code files, where the section has to live in a comment. */
export function beforeYouFinishComment(open: string, close: string, prefix: string): string {
  return [
    open,
    `${prefix}Before you finish:`,
    ...BEFORE_YOU_FINISH.map((line, i) => `${prefix}${i + 1}. ${line}`),
    close,
  ].join('\n');
}

export const sentenceList = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

export const withArticle = (noun: string) => `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;
