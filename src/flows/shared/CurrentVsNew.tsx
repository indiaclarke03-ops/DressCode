import { ArrowRight } from 'lucide-react';
import { useConfig } from '@/app/ConfigContext';
import { PaletteStrip } from './PaletteStrip';

/** Restyle only: the old palette above the new one. */
export function CurrentPalette() {
  const { config } = useConfig();
  const colours = config.restyle?.extracted?.colors ?? [];
  if (config.mode !== 'restyle' || colours.length === 0) return null;
  return <PaletteStrip label="Current" colours={colours} />;
}

/** Restyle only: the old font beside the new one. */
export function CurrentFont() {
  const { config, tokens } = useConfig();
  const [font] = config.restyle?.extracted?.fonts ?? [];
  if (config.mode !== 'restyle' || !font) return null;
  return (
    <p className="m-0 flex flex-wrap items-center gap-2 rounded-card border border-line bg-surface px-4 py-3 text-ink">
      <span style={{ fontFamily: `'${font}', ui-sans-serif, sans-serif` }}>{font}</span>
      <ArrowRight aria-label="becomes" size={16} className="text-muted" />
      <span style={{ fontFamily: `'${tokens.fonts.heading.family}', ${tokens.fonts.heading.fallback}` }}>
        {tokens.fonts.heading.family}
      </span>
    </p>
  );
}
