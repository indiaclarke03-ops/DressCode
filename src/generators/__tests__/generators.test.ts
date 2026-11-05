import { describe, expect, it } from 'vitest';
import { PROJECT_QUESTIONS } from '@/flows/shared/projectQuestions';
import { createDefaultConfig } from '@/tokens/defaults';
import { STYLE_PRESETS } from '@/tokens/presets';
import { deriveTokens } from '@/tokens/deriveTokens';
import { PROJECT_TYPES, type DesignConfig } from '@/tokens/types';
import { claudeMdSnippet } from '../claudeMdSnippet';
import { designMd, direction } from '../designMd';
import { generateFiles } from '../index';
import { kickoff } from '../kickoff';
import { ANSWER_RULES } from '../projectRules';
import { describeColour, styleSlug, styleTitle } from '../shared';
import { restyleMd } from '../restyleMd';
import { skillMd, skillPath } from '../skillMd';
import { MEDIUMS, stylePrompt } from '../stylePrompt';
import { tailwind } from '../tailwind';
import { tokensCss } from '../tokensCss';

const quietLedger: DesignConfig = {
  ...createDefaultConfig('fresh', 'dashboard'),
  name: 'Quiet Ledger',
  projectOptions: { nav: 'sidebar', numberFormat: 'abbreviated-1-2k' },
};
const lively: DesignConfig = {
  ...createDefaultConfig('fresh', 'event'),
  name: 'Transit Futures',
  accent: '#B84A26',
  theme: 'dark',
  depth: 'layered',
};

const allTypes = PROJECT_TYPES.map((type) => createDefaultConfig('fresh', type));

describe('DESIGN.md', () => {
  const md = designMd(quietLedger, deriveTokens(quietLedger));

  it('matches the target shape', () => {
    for (const heading of ['# Design Brief: Quiet Ledger', 'Project type: Data dashboard', '## Direction', '## Colour tokens', '## Typography', '## Spacing, radius, depth', '## Motion', '## Layout rules', '## Dashboard rules', '## Do not', '## Before you finish']) {
      expect(md).toContain(heading);
    }
  });

  it('reads like direction, not a settings dump', () => {
    expect(direction(quietLedger)).toBe(
      'A calm, information-dense dashboard. Light theme, sharp corners, flat surfaces separated by hairline borders. One deep green accent used sparingly for primary actions and highlights. Typography carries the hierarchy, not colour. Everything sits on a strict grid.',
    );
  });

  it('uses the real token values', () => {
    const tokens = deriveTokens(quietLedger);
    expect(md).toContain(`| accent | ${tokens.colors.accent} |`);
    expect(md).toContain(`Scale: ${tokens.type.ratio} (${tokens.type.sizes.join(' / ')})`);
    expect(md).toContain(`Data palette (categorical): ${tokens.data.categorical.join(', ')}`);
  });

  it('turns project answers into rules', () => {
    expect(md).toContain('Left sidebar navigation, 240px');
    expect(md).toContain('Abbreviate in cards (1.2K), full values in tables');
  });

  it('leaves out data palettes where the project has no use for them', () => {
    const docs = createDefaultConfig('fresh', 'docs');
    expect(designMd(docs, deriveTokens(docs))).not.toContain('Data palette');
  });

  it('keeps custom avoid items and drops unchecked ones', () => {
    const config = { ...quietLedger, avoid: ['gradients', 'Skeuomorphic buttons'] };
    const output = designMd(config, deriveTokens(config));
    expect(output).toContain('- Use purple-to-blue or rainbow gradients');
    expect(output).toContain('- Skeuomorphic buttons');
    expect(output).not.toContain('Use emoji as icons');
  });

  it('never leaks internals', () => {
    for (const config of allTypes) {
      const output = designMd(config, deriveTokens(config));
      expect(output).not.toMatch(/\bundefined\b|\bNaN\b|\[object/);
      expect(output).not.toMatch(/^- (gradients|emoji-icons|three-cards)$|mono-accent/m);
    }
  });
});

describe('the wider range', () => {
  const look = (id: string) => {
    const preset = STYLE_PRESETS.find((item) => item.id === id);
    if (!preset) throw new Error(id);
    return preset.config;
  };

  it('describes each look differently, in real sentences', () => {
    const sentences = STYLE_PRESETS.map((preset) => direction(preset.config));
    expect(new Set(sentences).size).toBe(STYLE_PRESETS.length);
    for (const sentence of sentences) expect(sentence).not.toMatch(/undefined|  |\.\./);
  });

  it('spells out the distinctive parts', () => {
    const riot = look('pop-riot');
    expect(direction(riot)).toContain('thick outlines with hard offset shadows');
    expect(direction(riot)).toContain('uppercase');
    expect(direction(riot)).toContain('Colour fills nav bars');
    const output = designMd(riot, deriveTokens(riot));
    expect(output).toContain('hard shadow');
    expect(output).toContain('Background texture: dots');
    expect(direction(look('broadsheet'))).toContain('Black and white only');
    expect(direction(look('blueprint'))).toContain('Pages drenched in');
    expect(designMd(look('terminal'), deriveTokens(look('terminal')))).toContain('nothing animates');
  });

  it('drops avoid rules that contradict a deliberate choice', () => {
    const pills = look('playground');
    expect(designMd(pills, deriveTokens(pills))).not.toContain('oversized border radius');
    const riot = look('pop-riot');
    expect(designMd(riot, deriveTokens(riot))).not.toContain('drop shadows on every element');
  });

  it('carries the look into brand prompts', () => {
    const riot = look('pop-riot');
    expect(stylePrompt(riot, deriveTokens(riot), 'slides')).toContain('The look: ');
  });

  it('names a style after its look when unnamed', () => {
    expect(styleTitle({ ...look('terminal'), name: '' })).toBe('Terminal');
  });
});

describe('project answers', () => {
  const everyAnswer = PROJECT_TYPES.flatMap((type) =>
    PROJECT_QUESTIONS[type].flatMap((q) => q.options.map((o) => ({ question: q.id, answer: o.id }))),
  );

  it.each(everyAnswer)('$question: $answer has a rule', ({ question, answer }) => {
    expect(ANSWER_RULES[question]?.[answer]).toBeTruthy();
  });
});

describe('SKILL.md', () => {
  const md = skillMd(quietLedger, deriveTokens(quietLedger));

  it('has frontmatter and an install note', () => {
    expect(md.startsWith('---\nname: quiet-ledger-design\ndescription: Visual design system')).toBe(true);
    expect(md).toContain('.claude/skills/quiet-ledger-design/SKILL.md');
    expect(skillPath(quietLedger)).toBe('.claude/skills/quiet-ledger-design/SKILL.md');
  });

  it('carries the same brief as DESIGN.md', () => {
    expect(md).toContain(designMd(quietLedger, deriveTokens(quietLedger)));
  });
});

describe('CLAUDE.md snippet', () => {
  it.each(allTypes)('stays within 40 lines and starts correctly', (config) => {
    const snippet = claudeMdSnippet(config, deriveTokens(config));
    expect(snippet.startsWith('## Design system')).toBe(true);
    expect(snippet.trimEnd().split('\n').length).toBeLessThanOrEqual(40);
  });
});

describe('tokens.css', () => {
  it('includes a dark block for light styles', () => {
    expect(tokensCss(quietLedger, deriveTokens(quietLedger))).toContain(':root[data-theme="dark"]');
  });

  it('has no separate dark block for dark styles', () => {
    const css = tokensCss(lively, deriveTokens(lively));
    expect(css).not.toContain('data-theme');
    expect(css).toContain('color-scheme: dark');
  });

  it('has balanced braces', () => {
    const css = tokensCss(quietLedger, deriveTokens(quietLedger));
    expect(css.split('{').length).toBe(css.split('}').length);
  });
});

describe('tailwind', () => {
  const output = tailwind(quietLedger, deriveTokens(quietLedger));

  it('labels both versions', () => {
    expect(output).toContain('Tailwind v3');
    expect(output).toContain('theme: {');
    expect(output).toContain('extend: {');
    expect(output).toContain('Tailwind v4');
    expect(output).toContain('@theme {');
  });
});

describe('kickoff', () => {
  it('names the project and asks the agent to stop', () => {
    const prompt = kickoff(quietLedger, deriveTokens(quietLedger));
    expect(prompt).toContain("Read DESIGN.md. We're building a dashboard.");
    expect(prompt).toContain('then wait for me');
    expect(prompt).toContain('table, chart');
  });

  it('uses the right article', () => {
    const config = createDefaultConfig('fresh', 'event');
    expect(kickoff(config, deriveTokens(config))).toContain('building an event site');
  });
});

describe('every output', () => {
  it.each(allTypes)('$projectType includes "Before you finish"', (config) => {
    for (const file of generateFiles(config, deriveTokens(config))) {
      expect(file.content).toContain('efore you finish');
    }
  });

  it('is pure', () => {
    const snapshot = structuredClone(quietLedger);
    generateFiles(quietLedger, deriveTokens(quietLedger));
    expect(quietLedger).toEqual(snapshot);
  });
});

describe('names', () => {
  it('builds a name when none is given', () => {
    expect(styleTitle(createDefaultConfig('fresh', 'dashboard'))).toBe('Quiet Dashboard');
  });

  it('slugs accents and symbols safely', () => {
    expect(styleSlug({ ...quietLedger, name: 'Café & Co!' })).toBe('cafe-co');
    expect(styleSlug({ ...quietLedger, name: '日本語' })).toBe('custom-style');
  });

  it('describes colours in words', () => {
    expect(describeColour('#1F5C45')).toBe('deep green');
    expect(describeColour('#3A3A36')).toBe('graphite');
    expect(describeColour('#B84A26')).toBe('terracotta');
    expect(describeColour('#E5261F')).toBe('red');
    expect(describeColour('#E6287A')).toBe('pink');
    expect(describeColour('#7A2230')).toBe('deep red');
    expect(describeColour('#F5C518')).toBe('pale yellow');
  });
});

describe('style prompts', () => {
  const tokens = deriveTokens(quietLedger);

  it.each(MEDIUMS.map((medium) => medium.id))('%s is complete', (medium) => {
    const prompt = stylePrompt(quietLedger, tokens, medium);
    expect(prompt).toContain('"Quiet Ledger" brand style');
    expect(prompt).toContain(tokens.colors.accent);
    expect(prompt).toContain('Do not:');
    expect(prompt).toContain('Before you finish:');
  });

  it('gives a slide deck slide rules and no web instructions', () => {
    const prompt = stylePrompt(quietLedger, tokens, 'slides');
    expect(prompt).toContain('slide deck');
    expect(prompt).toContain('headings 40pt or larger');
    expect(prompt).not.toContain('1440px');
    expect(prompt).not.toContain('Radius:');
  });

  it('gives a graphic no web instructions', () => {
    const prompt = stylePrompt(quietLedger, tokens, 'graphic');
    expect(prompt).not.toContain('1440px');
    expect(prompt).toContain('thumbnail');
  });

  it('uses the free text for "Something else"', () => {
    expect(stylePrompt(quietLedger, tokens, 'other', 'a trade show banner')).toContain(
      "We're making a trade show banner.",
    );
  });
});

describe('RESTYLE.md', () => {
  const restyled: DesignConfig = {
    ...createDefaultConfig('restyle', 'dashboard'),
    name: 'Quiet Ledger',
    restyle: {
      stylingSystem: 'tailwind',
      keep: ['functionality', 'layout', 'components', 'brand-colour'],
      keepColor: '#1F5C45',
      scope: 'retheme',
      colorMap: { '#6C5CE7': 'accent', '#F1F1F1': 'surface', '#1F5C45': 'accent' },
    },
  };
  const md = restyleMd(restyled, deriveTokens(restyled));

  it('follows the template', () => {
    expect(md).toContain('# Restyle: apply the "Quiet Ledger" design to this project');
    expect(md).toContain('change how this project LOOKS, not what it DOES');
    expect(md).toContain('Keep: layout and page structure, the existing component library');
    expect(md).toContain('logo colour #1F5C45');
    expect(md).toContain('Scope: Re-theme only');
    expect(md).toContain('your Tailwind config and class names');
    expect(md).toContain('as a Tailwind theme');
  });

  it('writes the old to new map and leaves the kept colour alone', () => {
    expect(md).toContain('- #6C5CE7 → accent');
    expect(md).toContain('- #F1F1F1 → surface');
    expect(md).not.toContain('#1F5C45 → accent');
  });

  it('skips layout work for a re-theme, and keeps it otherwise', () => {
    expect(md).toContain('Skip this step');
    const full = { ...restyled, restyle: { ...restyled.restyle!, scope: 'full' as const } };
    expect(restyleMd(full, deriveTokens(full))).toContain('Apply layout and component rules');
  });

  it('names the gradual target', () => {
    const gradual = {
      ...restyled,
      restyle: { ...restyled.restyle!, scope: 'gradual' as const, gradualTarget: 'the Settings page' },
    };
    expect(restyleMd(gradual, deriveTokens(gradual))).toContain('Gradual: start with the Settings page');
  });

  it('protects copy only if it was kept', () => {
    expect(md).toContain('Do not change functionality, data logic, or routes.');
    const copy = { ...restyled, restyle: { ...restyled.restyle!, keep: ['functionality', 'copy'] } };
    expect(restyleMd(copy, deriveTokens(copy))).toContain('routes, or copy.');
  });

  it('still works with nothing pasted', () => {
    const blank = createDefaultConfig('restyle');
    const output = restyleMd(blank, deriveTokens(blank));
    expect(output).toContain('Match each old colour you find');
    expect(output).toContain('Keep: nothing beyond functionality');
  });

  it('replaces the kickoff prompt in restyle mode', () => {
    const labels = generateFiles(restyled, deriveTokens(restyled)).map((file) => file.label);
    expect(labels).toContain('RESTYLE.md');
    expect(labels).not.toContain('KICKOFF prompt');
  });
});
