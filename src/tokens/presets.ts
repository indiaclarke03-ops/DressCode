import { createDefaultConfig } from './defaults';
import { STYLE_DIRECTIONS, type StyleDirection } from './directions';
import type { DesignConfig } from './types';

/** Everything a direction sets, ready to lay over a config. */
export function directionFields(direction: StyleDirection): Partial<DesignConfig> {
  const { id, accent, neutral, fontPairingId, typeScale, choices } = direction;
  return { direction: id, accent, neutral, fontPairingId, typeScale, ...choices };
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  config: DesignConfig;
}

/** The examples gallery: each look, on the kind of project that suits it. */
export const STYLE_PRESETS: StylePreset[] = STYLE_DIRECTIONS.map((direction) => ({
  id: direction.id,
  name: direction.name,
  description: direction.description,
  config: {
    ...createDefaultConfig('fresh', direction.exampleProject),
    name: direction.name,
    ...directionFields(direction),
  },
}));
