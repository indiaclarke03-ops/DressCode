import type { TweakInput } from './types';

export const pageInput: TweakInput = {
  kind: 'text',
  key: 'page',
  label: 'Page name',
  placeholder: '<page name>',
};

export const select = (key: string, label: string, options: string[]): TweakInput => ({
  kind: 'select',
  key,
  label,
  options,
  initial: options[0] ?? '',
});

export const toggle = (key: string, label: string, initial = false): TweakInput => ({
  kind: 'toggle',
  key,
  label,
  initial,
});

export const color = (key: string, label: string, initial: string): TweakInput => ({
  kind: 'color',
  key,
  label,
  initial,
});

export const text = (key: string, label: string, placeholder: string): TweakInput => ({
  kind: 'text',
  key,
  label,
  placeholder,
});

export const SCOPE = "Don't change any behaviour, data or copy.";
