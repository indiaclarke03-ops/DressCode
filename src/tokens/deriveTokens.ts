import { generateDataPalette, needsDataPalette, type DataPalette } from './dataPalette';
import { getPairing, type FontRole } from './fontPairings';
import { generatePalette, type Palette } from './palette';
import type { DesignConfig } from './types';

const DENSITY = {
  airy: {
    baseSize: 16,
    lineHeight: 1.6,
    spacing: [8, 12, 16, 24, 32, 48, 64, 96],
    controlHeight: 44,
    gutter: 32,
  },
  compact: {
    baseSize: 14,
    lineHeight: 1.45,
    spacing: [4, 8, 12, 16, 24, 32, 48],
    controlHeight: 32,
    gutter: 24,
  },
};

const RADIUS = {
  sharp: { control: 2, card: 4 },
  soft: { control: 12, card: 16 },
};

export const TYPE_RATIO = { tight: 1.125, balanced: 1.2, dramatic: 1.333 };
/** Scale steps: one below body, body, then five above. */
const TYPE_STEPS = [-1, 0, 1, 2, 3, 4, 5];
const MIN_TYPE_SIZE = 12;

const MOTION = {
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
};

/** Shadow alpha as hex suffixes: dark surfaces need more to register. */
const SHADOW_ALPHA = {
  light: { soft: '14', wide: '0F' },
  dark: { soft: '66', wide: '4D' },
};

const EMPHASIS_COUNT = 3;

export interface DesignTokens {
  theme: DesignConfig['theme'];
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
  depth: { strategy: DesignConfig['depth']; card: string; raised: string; borderWidth: number };
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

function shadows(strategy: DesignConfig['depth'], theme: DesignConfig['theme']) {
  if (strategy === 'flat') return { card: 'none', raised: 'none' };
  const { soft, wide } = SHADOW_ALPHA[theme];
  return {
    card: `0 1px 2px #000000${soft}, 0 4px 12px #000000${wide}`,
    raised: `0 2px 4px #000000${soft}, 0 12px 32px #000000${wide}`,
  };
}

/** The single source of truth: preview, generators and CSS variables all read this. */
export function deriveTokens(config: DesignConfig): DesignTokens {
  const colors = generatePalette(config.accent, config.neutral, config.theme);
  const density = DENSITY[config.density];
  const pairing = getPairing(config.fontPairingId);
  const ratio = TYPE_RATIO[config.typeScale];

  const data = generateDataPalette(config.accent, colors, config.theme, config.colorStrategy);

  return {
    theme: config.theme,
    colors,
    data,
    emphasis:
      config.colorStrategy === 'expressive'
        ? data.categorical.slice(0, EMPHASIS_COUNT)
        : [colors.accent, colors.textMuted, colors.border],
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
      ...shadows(config.depth, config.theme),
      borderWidth: config.depth === 'flat' ? 1 : 0,
    },
    motion: MOTION[config.motion],
    layout: {
      kind: config.layout,
      ...LAYOUT[config.layout],
      gutter: density.gutter,
      controlHeight: density.controlHeight,
    },
  };
}
