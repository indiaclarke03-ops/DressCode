import { geoContains, geoInterpolate, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';

export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 500;

const ANTARCTICA = '010';
const HEX_RADIUS = 11;

/** Sample values for the demo only: stable per country, not real statistics. */
function sampleValue(id: string): number {
  const seed = [...id].reduce((total, char) => total * 31 + char.charCodeAt(0), 7);
  return ((seed % 89) + 6) / 100;
}

const topology = world as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
  land: GeometryCollection;
}>;

const countries = feature(topology, topology.objects.countries).features.filter(
  (country) => country.id !== ANTARCTICA,
);
const land = feature(topology, topology.objects.land);

const projection = geoNaturalEarth1().fitSize([MAP_WIDTH, MAP_HEIGHT], {
  type: 'FeatureCollection',
  features: countries,
});
const path = geoPath(projection);

export const REGIONS = countries.map((country) => {
  const id = String(country.id ?? country.properties.name);
  const [x, y] = path.centroid(country);
  return { id, d: path(country) ?? '', x, y, value: sampleValue(id) };
});

const FLOW_ROUTES: [[number, number], [number, number]][] = [
  [[-70, -33], [121, 31]],
  [[28, -26], [8, 50]],
  [[134, -25], [127, 37]],
  [[-98, 39], [-3, 54]],
  [[77, 20], [55, 25]],
];

export const FLOWS = FLOW_ROUTES.map(([from, to]) => {
  const between = geoInterpolate(from, to);
  const steps = Array.from({ length: 24 }, (_, index) => between(index / 23));
  return path({ type: 'LineString', coordinates: steps }) ?? '';
});

function hexagon(x: number, y: number): string {
  const corners = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index + Math.PI / 6;
    return `${x + (HEX_RADIUS - 1) * Math.cos(angle)},${y + (HEX_RADIUS - 1) * Math.sin(angle)}`;
  });
  return corners.join(' ');
}

function buildHexes() {
  const hexes: { points: string; value: number }[] = [];
  const stepX = HEX_RADIUS * Math.sqrt(3);
  const stepY = HEX_RADIUS * 1.5;
  for (let row = 0; row * stepY < MAP_HEIGHT; row += 1) {
    for (let column = 0; column * stepX < MAP_WIDTH; column += 1) {
      const x = column * stepX + (row % 2 ? stepX / 2 : 0);
      const y = row * stepY;
      const location = projection.invert?.([x, y]);
      if (location && geoContains(land, location)) {
        hexes.push({ points: hexagon(x, y), value: sampleValue(`${row}-${column}`) });
      }
    }
  }
  return hexes;
}

export const HEXES = buildHexes();

/** Quantises 0..1 into the five-step sequential scale. */
export function sequentialStep(value: number): string {
  return `var(--bb-sequential-${Math.min(5, Math.floor(value * 5) + 1)})`;
}
