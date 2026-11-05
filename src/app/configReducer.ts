import { normalizeHex } from '@/tokens/color';
import {
  choicesFor,
  createDefaultConfig,
  createRestyleConfig,
  LOCKED_KEEP_ITEM,
} from '@/tokens/defaults';
import { defaultPairingId, getPairing } from '@/tokens/fontPairings';
import { fixAccent, generatePalette } from '@/tokens/palette';
import type { ChoiceKey, Choices, DesignConfig, ProjectType, RestyleConfig } from '@/tokens/types';

type EditableFields = Pick<DesignConfig, 'name' | 'neutral' | 'fontPairingId' | 'typeScale'>;

export type ConfigAction =
  | { type: 'set'; patch: Partial<Choices & EditableFields> }
  | { type: 'noPreference'; key: ChoiceKey }
  | { type: 'setMode'; mode: DesignConfig['mode'] }
  | { type: 'setProjectType'; projectType: ProjectType; other?: string }
  | { type: 'setAccent'; accent: string }
  | { type: 'fixContrast' }
  | { type: 'setProjectOption'; key: string; value: string | boolean }
  | { type: 'toggleAvoid'; item: string }
  | { type: 'setRestyle'; patch: Partial<RestyleConfig> }
  | { type: 'load'; config: DesignConfig }
  | { type: 'reset' };

const CHOICE_KEYS: ChoiceKey[] = [
  'theme', 'density', 'radius', 'depth', 'colorStrategy', 'headingStyle', 'motion', 'layout',
];

/** A heading style change can leave the pairing on the wrong side of the filter. */
function keepPairingInStyle(config: DesignConfig): DesignConfig {
  if (getPairing(config.fontPairingId).style === config.headingStyle) return config;
  return { ...config, fontPairingId: defaultPairingId(config.headingStyle) };
}

/** Moves choices that were on the old type's default; deliberate picks stay put. */
function applyProjectType(config: DesignConfig, projectType: ProjectType, other?: string) {
  const previous = choicesFor(config.projectType);
  const next = choicesFor(projectType);
  const moved = Object.fromEntries(
    CHOICE_KEYS.filter((key) => config[key] === previous[key]).map((key) => [key, next[key]]),
  ) as Partial<Choices>;

  const { projectTypeOther: _dropped, ...rest } = config;
  return {
    ...rest,
    ...moved,
    projectType,
    ...(projectType === 'other' && other !== undefined ? { projectTypeOther: other } : {}),
    projectOptions: projectType === config.projectType ? config.projectOptions : {},
  };
}

function withRestyle(config: DesignConfig, patch: Partial<RestyleConfig>): DesignConfig {
  const restyle = { ...(config.restyle ?? createRestyleConfig()), ...patch };
  const keep = restyle.keep.includes(LOCKED_KEEP_ITEM)
    ? restyle.keep
    : [...restyle.keep, LOCKED_KEEP_ITEM];
  return { ...config, restyle: { ...restyle, keep } };
}

export function configReducer(config: DesignConfig, action: ConfigAction): DesignConfig {
  switch (action.type) {
    case 'set':
      return keepPairingInStyle({ ...config, ...action.patch });
    case 'noPreference':
      return keepPairingInStyle({
        ...config,
        [action.key]: choicesFor(config.projectType)[action.key],
      });
    case 'setMode':
      if (config.mode === action.mode) return config;
      return action.mode === 'restyle' && !config.restyle
        ? { ...config, mode: action.mode, restyle: createRestyleConfig() }
        : { ...config, mode: action.mode };
    case 'setProjectType':
      return keepPairingInStyle(applyProjectType(config, action.projectType, action.other));
    case 'setAccent': {
      const accent = normalizeHex(action.accent);
      return accent ? { ...config, accent } : config;
    }
    case 'fixContrast': {
      const palette = generatePalette(config.accent, config.neutral, config.theme);
      return { ...config, accent: fixAccent(config.accent, palette) };
    }
    case 'setProjectOption':
      return {
        ...config,
        projectOptions: { ...config.projectOptions, [action.key]: action.value },
      };
    case 'toggleAvoid': {
      const item = action.item.trim();
      if (!item) return config;
      const avoid = config.avoid.includes(item)
        ? config.avoid.filter((entry) => entry !== item)
        : [...config.avoid, item];
      return { ...config, avoid };
    }
    case 'setRestyle':
      return withRestyle(config, action.patch);
    case 'load':
      return action.config;
    case 'reset':
      return createDefaultConfig(config.mode);
  }
}
