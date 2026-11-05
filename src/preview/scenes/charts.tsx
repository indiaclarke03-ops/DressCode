import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const AXIS = { fontSize: 'var(--bb-text-1)', fill: 'var(--bb-color-text-muted)' };
const GRID = 'var(--bb-color-border)';

export type ChartPalette = 'separate-categories' | 'low-to-high' | 'above-and-below-a-midpoint';

const SERIES: Record<ChartPalette, [string, string, string]> = {
  'separate-categories': ['var(--bb-data-1)', 'var(--bb-data-2)', 'var(--bb-data-3)'],
  'low-to-high': ['var(--bb-sequential-5)', 'var(--bb-sequential-3)', 'var(--bb-sequential-2)'],
  'above-and-below-a-midpoint': ['var(--bb-diverging-7)', 'var(--bb-diverging-1)', 'var(--bb-diverging-5)'],
};

function Frame({ height, palette, children }: { height: string; palette: string; children: React.ReactElement }) {
  return (
    <div className={`w-full ${height}`} data-palette={palette}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const PRICE_DATA = MONTHS.map((month, index) => ({
  month,
  wholesale: [82, 79, 74, 71, 66, 63, 65, 61, 58, 54][index],
  retail: [96, 95, 93, 90, 88, 85, 84, 83, 81, 79][index],
}));

export function PriceLines({ palette = 'separate-categories' }: { palette?: ChartPalette }) {
  const [first, second] = SERIES[palette];
  return (
    <Frame height="h-48" palette={palette}>
      <LineChart data={PRICE_DATA} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Line dataKey="retail" stroke={first} strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line dataKey="wholesale" stroke={second} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </Frame>
  );
}

const REGION_DATA = [
  { region: 'North', solar: 34, wind: 51, hydro: 15 },
  { region: 'East', solar: 42, wind: 38, hydro: 8 },
  { region: 'South', solar: 58, wind: 22, hydro: 12 },
  { region: 'West', solar: 29, wind: 44, hydro: 21 },
];

export function RegionBars({ palette = 'separate-categories' }: { palette?: ChartPalette }) {
  const [first, second, third] = SERIES[palette];
  return (
    <Frame height="h-48" palette={palette}>
      <BarChart data={REGION_DATA} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="region" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Bar dataKey="solar" stackId="mix" fill={first} isAnimationActive={false} />
        <Bar dataKey="wind" stackId="mix" fill={second} isAnimationActive={false} />
        <Bar dataKey="hydro" stackId="mix" fill={third} isAnimationActive={false} />
      </BarChart>
    </Frame>
  );
}

const SCENARIO_DATA = [2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040].map((year, index) => {
  const central = [100, 94, 87, 79, 72, 65, 59, 54][index] ?? 0;
  return { year, central, band: [central - index * 2, central + index * 3] };
});

export function ScenarioChart({ uncertainty }: { uncertainty: boolean }) {
  return (
    <Frame height="h-56" palette={uncertainty ? 'band' : 'line'}>
      <ComposedChart data={SCENARIO_DATA} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="year" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={[20, 120]} />
        {uncertainty ? (
          <Area
            dataKey="band"
            fill="var(--bb-sequential-2)"
            stroke="none"
            isAnimationActive={false}
          />
        ) : null}
        <Line
          dataKey="central"
          stroke="var(--bb-color-accent)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </Frame>
  );
}

const TREND_DATA = [2015, 2017, 2019, 2021, 2023, 2025].map((year, index) => ({
  year,
  value: [18, 21, 27, 33, 41, 52][index],
}));

export function AnnotatedTrend({ callouts }: { callouts: boolean }) {
  return (
    <Frame height="h-52" palette={callouts ? 'callouts' : 'minimal'}>
      <AreaChart data={TREND_DATA} margin={{ top: 20, right: 8, left: -24, bottom: 0 }}>
        <XAxis dataKey="year" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        {callouts ? (
          <ReferenceLine
            x={2021}
            stroke="var(--bb-color-text-muted)"
            strokeDasharray="3 3"
            label={{ value: 'Tariffs begin', position: 'top', ...AXIS }}
          />
        ) : null}
        <Area
          dataKey="value"
          stroke="var(--bb-color-accent)"
          fill="var(--bb-sequential-2)"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </Frame>
  );
}
