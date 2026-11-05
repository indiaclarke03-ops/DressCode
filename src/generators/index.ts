import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { claudeMdSnippet } from './claudeMdSnippet';
import { designMd } from './designMd';
import { kickoff } from './kickoff';
import { restyleMd } from './restyleMd';
import { skillMd, skillPath } from './skillMd';
import { tailwind } from './tailwind';
import { tokensCss } from './tokensCss';

export type CodeLanguage = 'markdown' | 'css';

export interface GeneratedFile {
  id: string;
  /** The tab label. */
  label: string;
  /** Path inside the zip. */
  path: string;
  language: CodeLanguage;
  content: string;
}

/** Every export for a config, in tab order. */
export function generateFiles(config: DesignConfig, tokens: DesignTokens): GeneratedFile[] {
  const file = (
    id: string,
    label: string,
    path: string,
    language: CodeLanguage,
    content: string,
  ): GeneratedFile => ({ id, label, path, language, content });

  return [
    file('design', 'DESIGN.md', 'DESIGN.md', 'markdown', designMd(config, tokens)),
    file('skill', 'SKILL.md', skillPath(config), 'markdown', skillMd(config, tokens)),
    file('claude', 'CLAUDE.md snippet', 'CLAUDE-snippet.md', 'markdown', claudeMdSnippet(config, tokens)),
    file('tokens', 'tokens.css', 'tokens.css', 'css', tokensCss(config, tokens)),
    file('tailwind', 'tailwind', 'tailwind-theme.txt', 'css', tailwind(config, tokens)),
    config.mode === 'restyle'
      ? file('restyle', 'RESTYLE.md', 'RESTYLE.md', 'markdown', restyleMd(config, tokens))
      : file('kickoff', 'KICKOFF prompt', 'KICKOFF.md', 'markdown', kickoff(config, tokens)),
  ];
}
