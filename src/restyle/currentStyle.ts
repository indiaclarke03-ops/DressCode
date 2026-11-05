import { pickForeground } from '@/tokens/palette';
import type { RestyleConfig } from '@/tokens/types';

const ROLE_VARIABLES: Record<string, string> = {
  background: '--bb-color-background',
  surface: '--bb-color-surface',
  'surface-raised': '--bb-color-surface-raised',
  border: '--bb-color-border',
  text: '--bb-color-text',
  'text-muted': '--bb-color-text-muted',
  accent: '--bb-color-accent',
  success: '--bb-color-success',
  warning: '--bb-color-warning',
  danger: '--bb-color-danger',
};

/** Layers the old look over the new variables, so a preview can show "Current". */
export function currentCssVars(
  newVars: Record<string, string>,
  restyle: RestyleConfig,
): Record<string, string> {
  const vars = { ...newVars };
  for (const [hex, role] of Object.entries(restyle.colorMap)) {
    const variable = ROLE_VARIABLES[role];
    if (variable) vars[variable] = hex;
  }

  const accent = vars['--bb-color-accent'];
  if (accent) {
    vars['--bb-color-accent-foreground'] = pickForeground(accent, '#111111');
    vars['--bb-emphasis-1'] = accent;
  }

  const { fonts = [], radii = [], shadows = [] } = restyle.extracted ?? {};
  const [font] = fonts;
  if (font) {
    const stack = `'${font}', ui-sans-serif, system-ui, sans-serif`;
    vars['--bb-font-heading'] = stack;
    vars['--bb-font-body'] = stack;
  }
  const [radius] = radii;
  if (radius) {
    vars['--bb-radius-card'] = radius;
    vars['--bb-radius-control'] = radius;
  }
  const [shadow] = shadows;
  if (shadow) vars['--bb-shadow-card'] = shadow;
  return vars;
}
