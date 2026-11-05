import { describe, expect, it } from 'vitest';
import { combineTweaks, DESIGN_LINE, initialValues, promptSegments, type BasketItem } from './build';
import { ALL_TWEAKS, searchTweaks, TWEAK_CATEGORIES } from './index';

const none = { hasDesignMd: false, verify: false };
const both = { hasDesignMd: true, verify: true };
const byId = (id: string) => {
  const tweak = ALL_TWEAKS.find((item) => item.id === id);
  if (!tweak) throw new Error(id);
  return tweak;
};

describe('tweak data', () => {
  it('has at least 40 tweaks across all nine categories', () => {
    expect(ALL_TWEAKS.length).toBeGreaterThanOrEqual(40);
    expect(TWEAK_CATEGORIES).toEqual([
      'Colour', 'Typography', 'Layout & spacing', 'Components', 'Charts', 'Maps',
      'Simulators & inputs', 'Motion', 'Polish & accessibility',
    ]);
  });

  it('has unique ids', () => {
    expect(new Set(ALL_TWEAKS.map((tweak) => tweak.id)).size).toBe(ALL_TWEAKS.length);
  });

  it.each(ALL_TWEAKS.map((tweak) => [tweak.id, tweak] as const))(
    '%s produces a clean prompt from its defaults',
    (_id, tweak) => {
      const prompt = tweak.template(initialValues(tweak), both);
      expect(prompt).not.toMatch(/\bundefined\b|\bNaN\b|\[object/);
      expect(prompt).toContain('When done, screenshot');
      expect(prompt.endsWith(`.`)).toBe(true);
      expect(prompt).not.toMatch(/- $|\n\n/);
    },
  );

  it.each(ALL_TWEAKS.map((tweak) => [tweak.id, tweak] as const))(
    '%s: every select option changes the prompt, or a text field fills in',
    (_id, tweak) => {
      for (const input of tweak.inputs) {
        if (input.kind !== 'select') continue;
        const prompts = input.options.map((option) =>
          tweak.template({ ...initialValues(tweak), [input.key]: option }, none),
        );
        expect(new Set(prompts).size).toBe(input.options.length);
      }
    },
  );
});

describe('prompt shape', () => {
  it('matches the example in the spec', () => {
    const tweak = byId('change-map-type');
    expect(tweak.template(initialValues(tweak), both)).toBe(
      [
        'Change the map on the <page name> page from a point map to a choropleth.',
        '- Shade regions by <metric> using a sequential scale from #E8F0EC to #1F5C45 (5 steps).',
        '- Add a legend in the bottom-left showing the steps and their ranges.',
        '- Keep hover tooltips showing region name and value.',
        "- Don't change the data loading or any other page.",
        'Follow DESIGN.md for anything not specified here.',
        'When done, screenshot the page at 1440px and 390px and check the legend is readable.',
      ].join('\n'),
    );
  });

  it('respects the two global toggles', () => {
    const tweak = byId('fix-contrast');
    const plain = tweak.template({}, none);
    expect(plain).not.toContain(DESIGN_LINE);
    expect(plain).not.toContain('screenshot');
    expect(tweak.template({}, { hasDesignMd: true, verify: false })).toContain(DESIGN_LINE);
  });

  it('warns about a poor chart choice', () => {
    const tweak = byId('change-chart-type');
    expect(tweak.template({ type: 'donut' }, none)).toContain('Avoid this for more than 5 segments');
  });

  it('adds table options only when chosen', () => {
    const tweak = byId('add-table');
    const prompt = tweak.template({ sortable: false, sticky: false, pagination: true }, none);
    expect(prompt).toContain('Pagination');
    expect(prompt).not.toContain('Sortable');
  });
});

describe('inline fields', () => {
  it('splits a prompt around its text inputs', () => {
    const tweak = byId('responsive');
    const segments = promptSegments(tweak, initialValues(tweak), none);
    expect(segments[0]).toEqual({ kind: 'text', text: 'Make the ' });
    expect(segments[1]).toEqual({ kind: 'field', key: 'page' });
  });

  it('fills in a typed value in the copied prompt', () => {
    expect(byId('responsive').template({ page: 'Pricing' }, none)).toContain('Make the Pricing page');
  });

  it('keeps the placeholder when a field is blank', () => {
    expect(byId('responsive').template({ page: '  ' }, none)).toContain('<page name>');
  });
});

describe('basket', () => {
  const items: BasketItem[] = [
    { tweak: byId('fix-contrast'), values: {} },
    { tweak: byId('responsive'), values: { page: 'Pricing' } },
  ];

  it('numbers the tweaks and says the closing lines once', () => {
    const prompt = combineTweaks(items, both);
    expect(prompt).toContain('Make these 2 changes:');
    expect(prompt).toContain('1. Find every text');
    expect(prompt).toContain('2. Make the Pricing page');
    expect(prompt.split(DESIGN_LINE)).toHaveLength(2);
    expect(prompt.split('screenshot the page')).toHaveLength(2);
  });

  it('indents bullets under their number', () => {
    expect(combineTweaks(items, none)).toContain('\n   - Body text needs 4.5:1');
  });

  it('respects the toggles', () => {
    const prompt = combineTweaks(items, none);
    expect(prompt).not.toContain(DESIGN_LINE);
    expect(prompt).not.toContain('screenshot');
  });
});

describe('search', () => {
  it('finds by title and by category', () => {
    expect(searchTweaks('dark').map((t) => t.id)).toContain('add-dark-mode');
    expect(searchTweaks('maps').length).toBe(7);
  });

  it('matches all words, in any order', () => {
    expect(searchTweaks('type chart').map((t) => t.id)).toEqual(['change-chart-type']);
  });

  it('returns everything for an empty query', () => {
    expect(searchTweaks('   ').length).toBe(ALL_TWEAKS.length);
  });
});
