import { stylingSystem } from '@/restyle/stylingSystems';
import { KEEP_ITEMS } from '@/tokens/defaults';
import type { DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig, RestyleConfig } from '@/tokens/types';
import { beforeYouFinish, styleTitle } from './shared';

const KEEP_LABELS: Record<string, string> = {
  layout: 'layout and page structure',
  copy: 'all copy and text',
  components: 'the existing component library (re-theme it, don\'t replace it)',
  icons: 'icons',
};

function keepList(restyle: RestyleConfig): string {
  const items = restyle.keep.flatMap((id) => {
    if (id === 'functionality') return [];
    if (id === 'brand-colour') {
      return [restyle.keepColor ? `logo colour ${restyle.keepColor}` : 'the brand and logo colour'];
    }
    return KEEP_ITEMS.some((item) => item.id === id) ? [KEEP_LABELS[id] ?? id] : [];
  });
  return items.length ? items.join(', ') : 'nothing beyond functionality';
}

function scopeLine(restyle: RestyleConfig): string {
  if (restyle.scope === 'full') return 'Full redesign';
  if (restyle.scope === 'retheme') return 'Re-theme only';
  const target = restyle.gradualTarget?.trim();
  return `Gradual: start with ${target || 'one page or component'}, then wait for me before rolling out`;
}

function colourMap(restyle: RestyleConfig): string[] {
  const kept = restyle.keep.includes('brand-colour') ? restyle.keepColor : undefined;
  const lines = Object.entries(restyle.colorMap)
    .filter(([hex]) => hex !== kept)
    .map(([hex, token]) => `   - ${hex} → ${token}`);
  return lines.length
    ? lines
    : ['   - Match each old colour you find to the nearest token in DESIGN.md, and list your choices'];
}

export function restyleMd(config: DesignConfig, _tokens: DesignTokens): string {
  const restyle = config.restyle;
  if (!restyle) return '';
  const system = stylingSystem(restyle.stylingSystem);
  const protectedThings = restyle.keep.includes('copy')
    ? 'functionality, data logic, routes, or copy'
    : 'functionality, data logic, or routes';
  const layoutStep =
    restyle.scope === 'retheme'
      ? '5. **Layout and component rules.** Skip this step: this is a re-theme only.'
      : '5. **Apply layout and component rules** from DESIGN.md.';

  return [
    `# Restyle: apply the "${styleTitle(config)}" design to this project`,
    '',
    'Read DESIGN.md first. Your job is to change how this project LOOKS, not what it DOES.',
    '',
    '## Rules',
    `- Do not change ${protectedThings}.`,
    `- Keep: ${keepList(restyle)}`,
    `- Scope: ${scopeLine(restyle)}`,
    '',
    '## Steps',
    `1. **Audit.** Find where styles live (${system.location}). List every hard-coded`,
    '   colour, font, radius and shadow, with file paths. Show me the list before changing anything.',
    '2. **Screenshot "before".** Run the app; capture key screens at 1440px and 390px.',
    `3. **Create tokens.** Add the tokens from DESIGN.md as a ${system.tokenHome}, in one place.`,
    '4. **Map old → new.** Replace hard-coded values with tokens. Old → new map:',
    ...colourMap(restyle),
    layoutStep,
    '6. **Screenshot "after"** at the same sizes. Compare with the "before" screenshots and with DESIGN.md.',
    "7. **Report** what changed, file by file, and anything you weren't sure about.",
    '',
    'Work in small commits, one step per commit, so changes are easy to review or revert.',
    '',
    beforeYouFinish(),
    '',
  ].join('\n');
}
