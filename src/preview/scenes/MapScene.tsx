import { generatePalette } from '@/tokens/palette';
import { sceneName } from './content';
import { FLOWS, HEXES, MAP_HEIGHT, MAP_WIDTH, REGIONS, sequentialStep } from './geo';
import { Field, Figure, Muted, Panel, Subtitle, Switch, Tag, Title } from './parts';
import { option, type SceneProps } from './types';

/** On phones the legend sits under the map, so it never covers the data. */
const LEGEND_POSITION: Record<string, string> = {
  'bottom-left': '@3xl:bottom-bb-2 @3xl:left-bb-2',
  'bottom-right': '@3xl:right-bb-2 @3xl:bottom-bb-2',
  'top-right': '@3xl:top-bb-2 @3xl:right-bb-2',
};

const LEGEND_STEPS = [1, 2, 3, 4, 5];
const HEAT_RADIUS = 34;

function Legend({ position }: { position: string }) {
  return (
    <Panel className={`m-bb-2 p-bb-2 @3xl:absolute @3xl:m-0 @3xl:w-44 ${LEGEND_POSITION[position] ?? ''}`}>
      <Muted>Renewable share</Muted>
      <div className="mt-1 flex">
        {LEGEND_STEPS.map((step) => (
          <span key={step} className="h-2 flex-1" style={{ background: `var(--bb-sequential-${step})` }} />
        ))}
      </div>
      <div className="flex justify-between">
        <Muted>6%</Muted>
        <Muted>95%</Muted>
      </div>
    </Panel>
  );
}

function Overlay({ type }: { type: string }) {
  if (type === 'points') {
    return REGIONS.filter((region) => region.value > 0.45).map((region) => (
      <circle
        key={region.id}
        cx={region.x}
        cy={region.y}
        r={2 + region.value * 7}
        fill="var(--bb-color-accent)"
        fillOpacity={0.75}
      />
    ));
  }
  if (type === 'heatmap') {
    return (
      <>
        <filter id="map-heat">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <g filter="url(#map-heat)">
          {REGIONS.filter((region) => region.value > 0.6).map((region) => (
            <circle
              key={region.id}
              cx={region.x}
              cy={region.y}
              r={HEAT_RADIUS * region.value}
              fill={sequentialStep(region.value)}
            />
          ))}
        </g>
      </>
    );
  }
  if (type === 'flow-lines') {
    return FLOWS.map((d) => (
      <path key={d} d={d} fill="none" stroke="var(--bb-color-accent)" strokeWidth={2} strokeLinecap="round" />
    ));
  }
  if (type === 'hexagon-grid') {
    return HEXES.map((hex) => (
      <polygon key={hex.points} points={hex.points} fill={sequentialStep(hex.value)} />
    ));
  }
  return null;
}

export default function MapScene({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  const mapType = option(config, 'mapType', 'shaded-regions');
  const basemap = option(config, 'basemap', config.theme === 'dark' ? 'minimal-dark' : 'minimal-light');
  const legend = option(config, 'legendPosition', 'bottom-left');
  const sidePanel = option(config, 'sidePanel', 'yes') === 'yes';

  const shapesOnly = basemap === 'nothing-shapes-only';
  const base = generatePalette(config.accent, config.neutral, basemap === 'minimal-dark' ? 'dark' : 'light');
  const shaded = mapType === 'shaded-regions';

  return (
    <div className="flex flex-col gap-bb-3 p-bb-4">
      <header className="flex items-end justify-between gap-bb-3">
        <div>
          <Muted>{brand}</Muted>
          <Title>{topic}</Title>
        </div>
        <Tag>Sample data, 2025</Tag>
      </header>

      <div className={`grid gap-bb-3 ${sidePanel ? '@3xl:grid-cols-[13rem_1fr_15rem]' : '@3xl:grid-cols-[13rem_1fr]'}`}>
        <Panel className="flex flex-col gap-bb-2 p-bb-3">
          <Subtitle>Filters</Subtitle>
          <Field label="Year" value="2025" />
          <Field label="Measure" value="Share of electricity" />
          <Switch label="Show imports" on />
        </Panel>

        <div
          data-reveal
          data-map={`${mapType} ${basemap}`}
          className="relative overflow-hidden rounded-bb-card border-(length:--bb-border-width) border-bb-border"
          style={{ background: shapesOnly ? 'transparent' : base.background }}
        >
          <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="block w-full" role="img" aria-label={`${mapType} world map`}>
            {shapesOnly && !shaded ? null : (
              <g>
                {REGIONS.map((region) => (
                  <path
                    key={region.id}
                    d={region.d}
                    fill={shaded ? sequentialStep(region.value) : base.border}
                    stroke={shapesOnly ? 'none' : base.background}
                    strokeWidth={0.5}
                  />
                ))}
              </g>
            )}
            <Overlay type={mapType} />
          </svg>
          <Legend position={legend} />
        </div>

        {sidePanel ? (
          <Panel className="p-bb-3">
            <Muted>Selected</Muted>
            <Subtitle>Norway</Subtitle>
            <Figure className="my-bb-2">98%</Figure>
            <Muted>Up 2 points since 2020. Hydro supplies nearly all of it.</Muted>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
