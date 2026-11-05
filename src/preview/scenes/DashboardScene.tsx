import { sceneName } from './content';
import { PriceLines, RegionBars, type ChartPalette } from './charts';
import { DataTable, type TableDensity, type TableStyle } from './DataTable';
import { Figure, Field, MobileBrand, Muted, NavItem, Panel, Subtitle, Tag, Title, type FieldStyle } from './parts';
import { option, type SceneProps } from './types';

const NAV = ['Overview', 'Generation', 'Demand', 'Tariffs', 'Reports'];

const KPIS = [
  { label: 'Grid demand', short: '48.2K MWh', full: '48,214 MWh', delta: '2.1% on last week' },
  { label: 'Renewable share', short: '61%', full: '61.4%', delta: '4 points up' },
  { label: 'Average tariff', short: '24.5p', full: '24.52p', delta: '1.8p lower' },
  { label: 'Outages', short: '3', full: '3', delta: '2 resolved' },
];

const COLUMNS = ['Region', 'Demand (MWh)', 'Renewable', 'Tariff'];

const ROWS: Record<string, string[][]> = {
  short: [
    ['North', '12.4K', '68%', '23.9p'],
    ['East', '9.8K', '54%', '25.1p'],
    ['South', '15.6K', '59%', '24.8p'],
    ['West', '10.4K', '64%', '24.2p'],
  ],
  full: [
    ['North', '12,402', '68.2%', '23.91p'],
    ['East', '9,811', '54.0%', '25.14p'],
    ['South', '15,604', '59.3%', '24.82p'],
    ['West', '10,397', '64.1%', '24.20p'],
  ],
};

function Sidebar({ brand }: { brand: string }) {
  return (
    <aside className="bb-band hidden w-48 shrink-0 border-r border-bb-border p-bb-3 @3xl:block">
      <Subtitle className="mb-bb-3">{brand}</Subtitle>
      {NAV.map((item, index) => (
        <NavItem key={item} active={index === 0}>
          {item}
        </NavItem>
      ))}
    </aside>
  );
}

function TopBar({ brand }: { brand: string }) {
  return (
    <header className="bb-band flex items-center gap-bb-3 overflow-hidden border-b border-bb-border px-bb-4 py-bb-2">
      <Subtitle className="shrink-0">{brand}</Subtitle>
      <nav className="flex gap-bb-1">
        {NAV.map((item, index) => (
          <NavItem key={item} active={index === 0}>
            {item}
          </NavItem>
        ))}
      </nav>
    </header>
  );
}

export default function DashboardScene({ config }: SceneProps) {
  const { brand, topic } = sceneName(config.projectType);
  const nav = option(config, 'nav', 'sidebar');
  const abbreviated = option(config, 'numberFormat', 'abbreviated-1-2k').startsWith('abbreviated');
  const palette = option(config, 'chartPalette', 'separate-categories') as ChartPalette;
  const density = option(config, 'tableDensity', 'comfortable') as TableDensity;
  const tableStyle = option(config, 'tableStyle', 'lines-between-rows') as TableStyle;
  const fieldStyle = option(config, 'formStyle', 'outlined') as FieldStyle;
  const emptyStates = config.projectOptions.emptyStates;
  const isInternal = config.projectType === 'internal';

  return (
    <div className="flex min-h-full">
      {nav === 'sidebar' || nav === 'both' ? <Sidebar brand={brand} /> : null}
      <div className="min-w-0 flex-1">
        {nav === 'sidebar' ? <MobileBrand brand={brand} /> : <TopBar brand={brand} />}
        <main className="flex flex-col gap-bb-4 p-bb-4">
          <div className="flex items-end justify-between gap-bb-3">
            <div>
              <Title>{topic}</Title>
              <Muted>Week ending 1 November</Muted>
            </div>
            <Tag>Live</Tag>
          </div>

          {isInternal ? <Field label="Search substations" value="Riverside" kind={fieldStyle} /> : null}

          <div className="grid grid-cols-2 gap-bb-3 @3xl:grid-cols-4 @3xl:bento:grid-cols-[2fr_1fr] @3xl:bento:*:first:row-span-3">
            {KPIS.map((kpi) => (
              <Panel key={kpi.label} className="p-bb-3">
                <Muted>{kpi.label}</Muted>
                <Figure className="my-1">{abbreviated ? kpi.short : kpi.full}</Figure>
                <Muted>{kpi.delta}</Muted>
              </Panel>
            ))}
          </div>

          <div className="grid gap-bb-3 @3xl:grid-cols-2 @3xl:editorial:grid-cols-[3fr_2fr] @3xl:bento:grid-cols-[2fr_1fr] poster:grid-cols-1">
            <Panel className="p-bb-3">
              <Subtitle className="mb-bb-2">Price per MWh</Subtitle>
              <PriceLines palette={palette} />
            </Panel>
            <Panel className="p-bb-3">
              <Subtitle className="mb-bb-2">Generation mix by region</Subtitle>
              <RegionBars palette={palette} />
            </Panel>
          </div>

          <Panel className="p-bb-3">
            <Subtitle className="mb-bb-2">Regions</Subtitle>
            <DataTable
              columns={COLUMNS}
              rows={ROWS[abbreviated ? 'short' : 'full'] ?? []}
              variant={tableStyle}
              density={density}
            />
          </Panel>

          {isInternal ? (
            <Panel className="p-bb-3">
              <Subtitle>Flagged substations</Subtitle>
              {emptyStates === 'an-illustration' ? (
                <svg aria-hidden viewBox="0 0 120 48" className="my-bb-2 h-16 w-full">
                  <rect x="30" y="14" width="60" height="26" rx="3" className="fill-bb-background stroke-bb-muted" />
                  <circle cx="60" cy="27" r="6" className="fill-bb-accent" />
                </svg>
              ) : null}
              <Muted>Nothing flagged today. New alerts will appear here.</Muted>
            </Panel>
          ) : null}
        </main>
      </div>
    </div>
  );
}
