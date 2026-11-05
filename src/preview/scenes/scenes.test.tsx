import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PROJECT_QUESTIONS } from '@/flows/shared/projectQuestions';
import { createDefaultConfig, SCENE_FOR_PROJECT, type SceneFamily } from '@/tokens/defaults';
import { deriveTokens } from '@/tokens/deriveTokens';
import { PROJECT_TYPES, type DesignConfig } from '@/tokens/types';
import AppScene from './AppScene';
import ChatScene from './ChatScene';
import DashboardScene from './DashboardScene';
import DocsScene from './DocsScene';
import EditorialScene from './EditorialScene';
import MapScene from './MapScene';
import MarketingScene from './MarketingScene';
import SimulatorScene from './SimulatorScene';
import type { SceneProps } from './types';

const SCENES: Record<SceneFamily, ComponentType<SceneProps>> = {
  dashboard: DashboardScene,
  simulator: SimulatorScene,
  map: MapScene,
  app: AppScene,
  chat: ChatScene,
  marketing: MarketingScene,
  editorial: EditorialScene,
  docs: DocsScene,
};

function render(config: DesignConfig): string {
  const Scene = SCENES[SCENE_FOR_PROJECT[config.projectType]];
  return renderToStaticMarkup(<Scene config={config} tokens={deriveTokens(config)} />);
}

const withOption = (config: DesignConfig, key: string, value: string) => ({
  ...config,
  projectOptions: { ...config.projectOptions, [key]: value },
});

const everyQuestion = PROJECT_TYPES.flatMap((projectType) =>
  PROJECT_QUESTIONS[projectType].map((question) => ({
    projectType,
    id: question.id,
    options: question.options.map((option) => option.id),
  })),
);

describe('scenes', () => {
  it.each(PROJECT_TYPES)('%s renders with no placeholder copy', (projectType) => {
    const html = render(createDefaultConfig('fresh', projectType));
    expect(html.length).toBeGreaterThan(500);
    expect(html).not.toMatch(/lorem ipsum|welcome to our platform/i);
    expect(html).not.toMatch(/\bundefined\b|\bNaN\b/);
  });

  it.each(everyQuestion)(
    '$projectType: every answer to $id changes the preview',
    ({ projectType, id, options }) => {
      const base = createDefaultConfig('fresh', projectType);
      const rendered = options.map((value) => render(withOption(base, id, value)));
      expect(new Set(rendered).size).toBe(options.length);
    },
  );
});
