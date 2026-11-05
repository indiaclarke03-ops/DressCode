import type { CodeLanguage } from '@/generators';

export type TokenKind = 'plain' | 'heading' | 'hex' | 'name' | 'comment';

export interface CodeToken {
  kind: TokenKind;
  text: string;
}

const PATTERNS: Record<CodeLanguage, RegExp> = {
  markdown: /(?<heading>^#{1,6} .*$)|(?<comment>^<!--.*-->$)|(?<hex>#[0-9A-Fa-f]{6}\b)|(?<name>`[^`\n]+`)/gm,
  css: /(?<comment>\/\*[\s\S]*?\*\/|^\s*\/\/.*$)|(?<hex>#[0-9A-Fa-f]{6}\b)|(?<name>--[\w-]+|@theme\b|\b[a-zA-Z]+(?=: ))/gm,
};

/** A small tokeniser for our own output: enough colour to scan a brief. */
export function highlight(code: string, language: CodeLanguage): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;
  for (const match of code.matchAll(PATTERNS[language])) {
    if (match.index > cursor) tokens.push({ kind: 'plain', text: code.slice(cursor, match.index) });
    const groups = match.groups ?? {};
    const kind = (['heading', 'comment', 'hex', 'name'] as const).find((name) => groups[name]);
    tokens.push({ kind: kind ?? 'plain', text: match[0] });
    cursor = match.index + match[0].length;
  }
  if (cursor < code.length) tokens.push({ kind: 'plain', text: code.slice(cursor) });
  return tokens;
}
