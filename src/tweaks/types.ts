export type TweakValue = string | boolean;
export type TweakValues = Record<string, TweakValue>;

interface BaseInput {
  key: string;
  label: string;
}

export type TweakInput =
  | (BaseInput & { kind: 'select'; options: string[]; initial: string })
  | (BaseInput & { kind: 'color'; initial: string })
  | (BaseInput & { kind: 'toggle'; initial: boolean })
  /** Shown as an editable field inside the prompt itself. */
  | (BaseInput & { kind: 'text'; placeholder: string });

export interface TweakOptions {
  hasDesignMd: boolean;
  verify: boolean;
}

export interface TweakDefinition {
  id: string;
  category: string;
  title: string;
  inputs: TweakInput[];
  template: (values: Record<string, unknown>, opts: TweakOptions) => string;
}
