import type { TweakDefinition, TweakInput, TweakOptions, TweakValues } from './types';

export const DESIGN_LINE = 'Follow DESIGN.md for anything not specified here.';
const SIZES = 'screenshot the page at 1440px and 390px';

type Reader = {
  text: (key: string) => string;
  on: (key: string) => boolean;
};

function reader(values: Record<string, unknown>, inputs: TweakInput[]): Reader {
  return {
    text: (key) => {
      const value = values[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
      const input = inputs.find((item) => item.key === key);
      if (input?.kind === 'text') return input.placeholder;
      return input?.kind === 'select' || input?.kind === 'color' ? input.initial : '';
    },
    on: (key) => {
      const value = values[key];
      if (typeof value === 'boolean') return value;
      const input = inputs.find((item) => item.key === key);
      return input?.kind === 'toggle' ? input.initial : false;
    },
  };
}

interface TweakSpec {
  id: string;
  title: string;
  inputs?: TweakInput[];
  /** The ask, then any bullets. */
  lines: (read: Reader) => string[];
  /** Finishes "...and check ___". */
  check: string;
}

/** Keeps every tweak the same shape: short, specific, scoped, verifiable. */
export function defineTweaks(category: string, specs: TweakSpec[]): TweakDefinition[] {
  return specs.map(({ id, title, inputs = [], lines, check }) => ({
    id,
    category,
    title,
    inputs,
    template: (values, opts) =>
      [
        ...lines(reader(values, inputs)),
        ...(opts.hasDesignMd ? [DESIGN_LINE] : []),
        ...(opts.verify ? [`When done, ${SIZES} and check ${check}.`] : []),
      ].join('\n'),
  }));
}

export function initialValues(tweak: TweakDefinition): TweakValues {
  const values: TweakValues = {};
  for (const input of tweak.inputs) {
    if (input.kind !== 'text') values[input.key] = input.initial;
  }
  return values;
}

export type PromptSegment = { kind: 'text'; text: string } | { kind: 'field'; key: string };

const OPEN = '\u0001';
const CLOSE = '\u0002';

/** Splits a prompt around its text inputs, so each can be edited in place. */
export function promptSegments(
  tweak: TweakDefinition,
  values: TweakValues,
  opts: TweakOptions,
): PromptSegment[] {
  const marked: TweakValues = { ...values };
  for (const input of tweak.inputs) {
    if (input.kind === 'text') marked[input.key] = `${OPEN}${input.key}${CLOSE}`;
  }
  const parts = tweak.template(marked, opts).split(new RegExp(`${OPEN}([^${CLOSE}]+)${CLOSE}`));
  return parts.flatMap((part, index): PromptSegment[] => {
    if (index % 2 === 1) return [{ kind: 'field', key: part }];
    return part ? [{ kind: 'text', text: part }] : [];
  });
}

export interface BasketItem {
  tweak: TweakDefinition;
  values: TweakValues;
}

/** Several tweaks as one numbered prompt, with the closing lines said only once. */
export function combineTweaks(items: BasketItem[], opts: TweakOptions): string {
  const bare: TweakOptions = { hasDesignMd: false, verify: false };
  const numbered = items.map(({ tweak, values }, index) => {
    const [first = '', ...rest] = tweak.template(values, bare).split('\n');
    return [`${index + 1}. ${first}`, ...rest.map((line) => `   ${line}`)].join('\n');
  });
  return [
    `Make these ${items.length} changes:`,
    '',
    ...numbered,
    '',
    ...(opts.hasDesignMd ? [DESIGN_LINE] : []),
    ...(opts.verify ? [`When done, ${SIZES} and check each change worked.`] : []),
  ]
    .join('\n')
    .trimEnd();
}
