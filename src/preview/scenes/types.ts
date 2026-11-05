import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';

export interface SceneProps {
  config: DesignConfig;
  tokens: DesignTokens;
}

/** Reads a project-details answer. Unanswered questions use the first option. */
export function option(config: DesignConfig, key: string, fallback: string): string {
  const value = config.projectOptions[key];
  return typeof value === 'string' ? value : fallback;
}
