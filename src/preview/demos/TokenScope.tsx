import type { CSSProperties, ReactNode } from 'react';
import { usePairingFonts } from '@/lib/fonts';
import { toCssVars } from '@/tokens/cssVars';
import { deriveTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';

/** Paints its children with a config's tokens, isolated from the tool's own theme. */
export function TokenScope({ config, className = '', children }: { config: DesignConfig; className?: string; children: ReactNode }) {
  usePairingFonts([config.fontPairingId]);
  const style = toCssVars(deriveTokens(config)) as CSSProperties;

  return (
    <span
      style={style}
      data-layout={config.layout}
      className={`bb-texture flex min-h-52 w-full flex-col justify-center gap-(--bb-space-3) overflow-hidden rounded-button bg-bb-background p-4 font-bb-body text-(length:--bb-text-2) leading-(--bb-line-height) text-bb-text ${className}`}
    >
      {children}
    </span>
  );
}
