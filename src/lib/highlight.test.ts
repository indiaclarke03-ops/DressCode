import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

const kinds = (code: string, language: 'markdown' | 'css') =>
  highlight(code, language).filter((t) => t.kind !== 'plain').map((t) => t.kind);

describe('highlight', () => {
  it('never loses text', () => {
    const code = '# Title\n| accent | #1F5C45 |\n`code` and more';
    expect(highlight(code, 'markdown').map((t) => t.text).join('')).toBe(code);
  });

  it('finds markdown headings, hex values and inline code', () => {
    expect(kinds('# Title\n#1F5C45 `x`', 'markdown')).toEqual(['heading', 'hex', 'name']);
  });

  it('finds css comments, variables and hex values', () => {
    expect(kinds('/* note */\n--bb-x: #1F5C45;', 'css')).toEqual(['comment', 'name', 'hex']);
  });
});
