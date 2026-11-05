import { chartTweaks } from './charts';
import { colourTweaks } from './colour';
import { componentTweaks } from './components';
import { layoutTweaks } from './layout';
import { mapTweaks } from './maps';
import { motionTweaks } from './motion';
import { polishTweaks } from './polish';
import { simulatorTweaks } from './simulators';
import { typographyTweaks } from './typography';

/** In display order. Add a tweak by adding it to one of these data files. */
export const TWEAK_GROUPS = [
  colourTweaks,
  typographyTweaks,
  layoutTweaks,
  componentTweaks,
  chartTweaks,
  mapTweaks,
  simulatorTweaks,
  motionTweaks,
  polishTweaks,
];

export const ALL_TWEAKS = TWEAK_GROUPS.flat();

export const TWEAK_CATEGORIES = TWEAK_GROUPS.flatMap((group) => group[0]?.category ?? []);

/** Matches titles and categories, so "map" or "dark" finds things fast. */
export function searchTweaks(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return ALL_TWEAKS.filter((tweak) => {
    const haystack = `${tweak.title} ${tweak.category}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
