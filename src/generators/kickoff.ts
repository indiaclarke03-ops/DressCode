import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { BEFORE_YOU_FINISH, projectNoun, withArticle } from './shared';

const RELEVANT_COMPONENTS: Partial<Record<DesignConfig['projectType'], string>> = {
  dashboard: 'table, chart',
  internal: 'table',
  simulator: 'slider, chart',
  map: 'legend, map panel',
  chat: 'message, message box',
  form: 'text field, progress indicator',
  ecommerce: 'product card',
};

export function kickoff(config: DesignConfig, _tokens: DesignTokens): string {
  const extras = RELEVANT_COMPONENTS[config.projectType];
  const components = `button, card, input${extras ? `, ${extras}` : ''}`;
  return [
    `Read DESIGN.md. We're building ${withArticle(projectNoun(config))}. Before writing features, set up the design tokens, base layout and a small component set (${components}). Screenshot and check against the brief, then wait for me.`,
    '',
    'Before you finish:',
    ...BEFORE_YOU_FINISH.map((line, index) => `${index + 1}. ${line}`),
    '',
  ].join('\n');
}
