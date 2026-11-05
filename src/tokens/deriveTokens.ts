import { generateDataPalette, needsDataPalette, type DataPalette } from './dataPalette';
import { getPairing, type FontRole } from './fontPairings';
import { baseTheme, generatePalette, type Palette } from './palette';
import type { DesignConfig } from './types';

const DENSITY = {
  compact: {
    baseSize: 14,
    lineHeight: 1.45,
    spacing: [4, 8, 12, 16, 24, 32, 48],
    controlHeight: 32,
    gutter: 24,
  },
  airy: {
    baseSize: 16,
    lineHeight: 1.6,
    spacing: [8, 12, 16, 24, 32, 48, 64, 96],
    controlHeight: 44,
    gutter: 32,
  },
  oversized: {
    baseSize: 18,
    lineHeight: 1.7,
    spacing: [12, 16, 24, 32, 48, 72, 96, 128],
    controlHeight: 56,
    gutter: 48,
  },
};

const RADIUS = {
  none: { control: 0, card: 0 },
  sharp: { control: 2, card: 4 },
  soft: { control: 12, card: 16 },
  pill: { control: 999, card: 28 },
};

export const TYPE_RATIO = { tight: 1.125, balanced: 1.2, dramatic: 1.333 };
/** Scale steps: one below body, body, then five above. */
const TYPE_STEPS = [-1, 0, 1, 2, 3, 4, 5];
const MIN_TYPE_SIZE = 12;

const MOTION = {
  still: { durationMs: 0, easing: 'linear', staggerMs: 0, spring: false },
  quiet: { durationMs: 140, easing: 'cubic-bezier(0.2, 0, 0, 1)', staggerMs: 0, spring: false },
  expressive: {
    durationMs: 280,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    staggerMs: 40,
    spring: true,
  },
};

const LAYOUT = {
  grid: { columns: 12, maxWidth: 1200, contentOffset: 0 },
  editorial: { columns: 12, maxWidth: 1080, contentOffset: 2 },
  bento: { columns: 6, maxWidth: 1240, contentOffset: 0 },
  poster: { columns: 12, maxWidth: 1440, contentOffset: 0 },
};

const HEADING_CASE = {
  sentence: { transform: 'none', tracking: '-0.01em', scale: 1 },
  uppercase: { transform: 'uppercase', tracking: '0.04em', scale: 0.92 },
  oversized: { transform: 'none', tracking: '-0.03em', scale: 1.5 },
};

/** Poster layouts lean on sheer size. */
const POSTER_SCALE = 1.35;
const BOLD_BORDER = 2;
const HARD_SHADOW_PX = 4;

/** Shadow alpha as hex suffixes: dark surfaces need more to register. */
const SHADOW_ALPHA = {
  light: { soft: '14', wide: '0F' },
  dark: { soft: '66', wide: '4D' },
};

/** Patterns are faint: texture should be felt before it is noticed. */
function textureCss(texture: DesignConfig['texture'], ink: string) {
  if (texture === 'dots') {
    return { image: `radial-gradient(${ink}26 1px, transparent 1px)`, size: '14px 14px' };
  }
  if (texture === 'lines') {
    return { image: `repeating-linear-gradient(0deg, ${ink}1A 0 1px, transparent 1px 16px)`, size: 'auto' };
  }
  if (texture === 'grain') {
    const noise =
      "%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E";
    return { image: `url("data:image/svg+xml,${noise}")`, size: '160px 160px' };
  }
  return { image: 'none', size: 'auto' };
}

const EMPHASIS_COUNT = 3;

export interface DesignTokens {
  theme: DesignConfig['theme'];
  /** The light or dark base beneath the theme. */
  colorScheme: 'light' | 'dark';
  colors: Palette;
  data: DataPalette;
  /** Colours for highlights: one accent and quiet tones, or several hues. */
  emphasis: string[];
  /** Whether the brief should spell the data palettes out. */
  includeDataPalette: boolean;
  fonts: { pairingName: string; heading: FontRole; body: FontRole; mono: FontRole };
  type: { ratio: number; baseSize: number; lineHeight: number; sizes: number[] };
  spacing: number[];
  radius: { control: number; card: number };
  depth: {
    strategy: DesignConfig['depth'];
    card: string;
    raised: string;
    borderWidth: number;
    borderColor: string;
  };
  heading: { case: DesignConfig['headingCase']; transform: string; tracking: string; scale: number };
  texture: { kind: DesignConfig['texture']; image: string; size: string };
  /** Bands are the nav bars, headers and hero blocks that can carry colour. */
  band: {
    background: string;
    text: string;
    muted: string;
    accent: string;
    accentText: string;
    onAccent: string;
    emphasis: string;
  };
  motion: { durationMs: number; easing: string; staggerMs: number; spring: boolean };
  layout: {
    kind: DesignConfig['layout'];
    columns: number;
    gutter: number;
    maxWidth: number;
    contentOffset: number;
    controlHeight: number;
  };
}

export function typeSizes(baseSize: number, ratio: number): number[] {
  const sizes: number[] = [];
  for (const step of TYPE_STEPS) {
    const size = Math.max(MIN_TYPE_SIZE, Math.round(baseSize * ratio ** step));
    const previous = sizes.at(-1);
    sizes.push(previous !== undefined && size <= previous ? previous + 1 : size);
  }
  return sizes;
}

function shadows(strategy: DesignConfig['depth'], scheme: 'light' | 'dark', ink: string) {
  if (strategy === 'flat' || strategy === 'borderless') return { card: 'none', raised: 'none' };
  if (strategy === 'bold') {
    const hard = `${HARD_SHADOW_PX}px ${HARD_SHADOW_PX}px 0 ${ink}`;
    return { card: hard, raised: hard };
  }
  const { soft, wide } = SHADOW_ALPHA[scheme];
  return {
    card: `0 1px 2px #000000${soft}, 0 4px 12px #000000${wide}`,
    raised: `0 2px 4px #000000${soft}, 0 12px 32px #000000${wide}`,
  };
}

/** Black and white replaces the accent with the text colour. */
function strategyColours(palette: Palette, strategy: DesignConfig['colorStrategy']): Palette {
  if (strategy !== 'monochrome') return palette;
  return {
    ...palette,
    accent: palette.text,
    accentText: palette.text,
    accentForeground: palette.background,
  };
}

/** The single source of truth: preview, generators and CSS variables all read this. */
export function deriveTokens(config: DesignConfig): DesignTokens {
  const colorScheme = baseTheme(config.theme);
  const colors = strategyColours(
    generatePalette(config.accent, config.neutral, config.theme),
    config.colorStrategy,
  );
  const density = DENSITY[config.density];
  const pairing = getPairing(config.fontPairingId);
  const ratio = TYPE_RATIO[config.typeScale];
  const data = generateDataPalette(colors.accent, colors, colorScheme, config.colorStrategy);
  const emphasis = {
    monochrome: [colors.accent, colors.textMuted, colors.border],
    'mono-accent': [colors.accent, colors.textMuted, colors.border],
    duotone: [...data.categorical.slice(0, 2), colors.border],
    expressive: data.categorical.slice(0, EMPHASIS_COUNT),
  }[config.colorStrategy];
  const usesBlocks = config.colorUse === 'blocks';

  return {
    theme: config.theme,
    colorScheme,
    colors,
    data,
    emphasis,
    band: usesBlocks
      ? {
          background: colors.accent,
          text: colors.accentForeground,
          muted: colors.accentForeground,
          accent: colors.accentForeground,
          accentText: colors.accentForeground,
          onAccent: colors.accent,
          emphasis: colors.accentForeground,
        }
      : {
          background: colors.surface,
          text: colors.text,
          muted: colors.textMuted,
          accent: colors.accent,
          accentText: colors.accentText,
          onAccent: colors.accentForeground,
          emphasis: emphasis[0] ?? colors.accent,
        },
    includeDataPalette: needsDataPalette(config),
    fonts: {
      pairingName: pairing.name,
      heading: pairing.heading,
      body: pairing.body,
      mono: pairing.mono,
    },
    type: {
      ratio,
      baseSize: density.baseSize,
      lineHeight: density.lineHeight,
      sizes: typeSizes(density.baseSize, ratio),
    },
    spacing: density.spacing,
    radius: RADIUS[config.radius],
    depth: {
      strategy: config.depth,
      ...shadows(config.depth, colorScheme, colors.text),
      borderWidth: config.depth === 'flat' ? 1 : config.depth === 'bold' ? BOLD_BORDER : 0,
      borderColor: config.depth === 'bold' ? colors.text : colors.border,
    },
    heading: {
      case: config.headingCase,
      ...HEADING_CASE[config.headingCase],
      scale: HEADING_CASE[config.headingCase].scale * (config.layout === 'poster' ? POSTER_SCALE : 1),
    },
    texture: { kind: config.texture, ...textureCss(config.texture, colors.text) },
    motion: MOTION[config.motion],
    layout: {
      kind: config.layout,
      ...LAYOUT[config.layout],
      gutter: density.gutter,
      controlHeight: density.controlHeight,
    },
  };
}
