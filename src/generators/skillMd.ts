import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { briefBody } from './designMd';
import { styleSlug } from './shared';

export function skillName(config: DesignConfig): string {
  return `${styleSlug(config)}-design`;
}

export function skillPath(config: DesignConfig): string {
  return `.claude/skills/${skillName(config)}/SKILL.md`;
}

export function skillMd(config: DesignConfig, tokens: DesignTokens): string {
  return [
    '---',
    `name: ${skillName(config)}`,
    'description: Visual design system for this project. Use whenever creating or restyling pages, components, charts, maps or layouts.',
    '---',
    '',
    `<!-- Install: save this file as ${skillPath(config)} -->`,
    '',
    briefBody(config, tokens),
  ].join('\n');
}
