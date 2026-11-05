const SAMPLE_SIZE = 120;
const DEFAULT_COLOURS = 6;

type Rgb = [number, number, number];

const toHex = ([r, g, b]: Rgb) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

function spread(pixels: Rgb[]): { channel: 0 | 1 | 2; low: number; high: number } {
  const ranges = ([0, 1, 2] as const).map((channel) => {
    const values = pixels.map((pixel) => pixel[channel]);
    return { channel, low: Math.min(...values), high: Math.max(...values) };
  });
  return ranges.reduce((a, b) => (b.high - b.low > a.high - a.low ? b : a));
}

function average(pixels: Rgb[]): Rgb {
  const total = pixels.reduce<Rgb>(
    (sum, pixel) => [sum[0] + pixel[0], sum[1] + pixel[1], sum[2] + pixel[2]],
    [0, 0, 0],
  );
  return [
    Math.round(total[0] / pixels.length),
    Math.round(total[1] / pixels.length),
    Math.round(total[2] / pixels.length),
  ];
}

/** Box-cut quantisation over RGBA bytes. Most common colours come first. */
export function quantize(rgba: Uint8ClampedArray, count = DEFAULT_COLOURS): string[] {
  const pixels: Rgb[] = [];
  for (let i = 0; i + 3 < rgba.length; i += 4) {
    if ((rgba[i + 3] ?? 0) > 127) pixels.push([rgba[i] ?? 0, rgba[i + 1] ?? 0, rgba[i + 2] ?? 0]);
  }
  if (pixels.length === 0) return [];

  const boxes: Rgb[][] = [pixels];
  while (boxes.length < count) {
    const splittable = boxes.filter((box) => {
      const { low, high } = spread(box);
      return high > low;
    });
    if (splittable.length === 0) break;
    const largest = splittable.reduce((a, b) => (b.length > a.length ? b : a));
    // Split at the middle of the range, not the median, so a big flat background
    // can't be averaged into a smaller accent.
    const { channel, low, high } = spread(largest);
    const middle = (low + high) / 2;
    boxes.splice(
      boxes.indexOf(largest),
      1,
      largest.filter((pixel) => pixel[channel] <= middle),
      largest.filter((pixel) => pixel[channel] > middle),
    );
  }

  const colours = boxes.sort((a, b) => b.length - a.length).map((box) => toHex(average(box)));
  return [...new Set(colours)];
}

/** Reads a screenshot's dominant colours on a canvas. The image never leaves the browser. */
export async function extractImageColors(file: File): Promise<string[]> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, SAMPLE_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) return [];
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return quantize(context.getImageData(0, 0, canvas.width, canvas.height).data);
}
