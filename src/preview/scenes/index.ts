import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SceneFamily } from '@/tokens/defaults';
import type { SceneProps } from './types';

/** Split per scene: maps and charts are heavy, and only one scene shows at a time. */
export const SCENES: Record<SceneFamily, LazyExoticComponent<ComponentType<SceneProps>>> = {
  dashboard: lazy(() => import('./DashboardScene')),
  simulator: lazy(() => import('./SimulatorScene')),
  map: lazy(() => import('./MapScene')),
  app: lazy(() => import('./AppScene')),
  chat: lazy(() => import('./ChatScene')),
  marketing: lazy(() => import('./MarketingScene')),
  editorial: lazy(() => import('./EditorialScene')),
  docs: lazy(() => import('./DocsScene')),
};
