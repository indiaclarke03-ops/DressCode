import { describe, expect, it } from 'vitest';
import { autoColorMap } from './autoColorMap';
import { currentCssVars } from './currentStyle';
import { quantize } from './extractImageColors';
import { parseStyles } from './parseStyles';

const PLAIN_CSS = `
/* Marketing site #123456 */
:root {
  --brand: #6C5CE7;
  --ink: #2D3436;
}
#fff { color: red; }
body { background: #ffffff; color: #2d3436; font-family: "Poppins", Arial, sans-serif; }
.card {
  background: #F1F1F1;
  border: 1px solid rgb(223, 230, 233);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.btn { background: #6c5ce7; color: #fff; border-radius: 12px; }
.btn:hover { background: hsl(247, 74%, 55%); }
.badge { border-top-left-radius: 4px; }
.error { color: #D63031; }
.ok { color: #00B894; }
.warn { color: #FDCB6E; }
.ghost { color: transparent; background: rgba(0, 0, 0, 0); }
h1 { font-family: 'Playfair Display', serif; }
code { font-family: var(--mono), monospace; box-shadow: none; }
`;

const TAILWIND_CONFIG = `
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'primary-dark': '#5B21B6',
        slate: { 50: '#F8FAFC', 200: '#E2E8F0', 500: '#64748B', 900: '#0F172A' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cal Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
};
`;

const SHADCN_GLOBALS = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --destructive: 0 84.2% 60.2%;
    --radius: 0.5rem;
  }
}
`;

const MUI_THEME = `
export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    error: { main: '#d32f2f' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: 'rgba(0, 0, 0, 0.87)' },
  },
  typography: { fontFamily: '"Nunito", "Helvetica", sans-serif' },
});
`;

describe('parseStyles', () => {
  const css = parseStyles(PLAIN_CSS);

  it('finds hex, rgb, hsl and short hex, in every case', () => {
    expect(css.colors).toEqual(expect.arrayContaining(['#6C5CE7', '#2D3436', '#FFFFFF', '#F1F1F1', '#DFE6E9']));
  });

  it('merges case variants, and ranks by use', () => {
    expect(css.colors[0]).toMatch(/#6C5CE7|#2D3436|#FFFFFF/);
    expect(css.colors.filter((c) => c === '#6C5CE7')).toHaveLength(1);
  });

  it('ignores comments, id selectors and transparent colours', () => {
    expect(css.colors).not.toContain('#123456');
    expect(css.colors).not.toContain('#000000');
    expect(parseStyles('#bad { color: red }').colors).toEqual([]);
  });

  it('finds named fonts and skips system stacks and variables', () => {
    expect(css.fonts).toEqual(['Poppins', 'Playfair Display']);
  });

  it('finds radii and shadows, and skips "none"', () => {
    expect(css.radii).toEqual(['12px', '4px']);
    expect(css.shadows).toEqual(['0 2px 8px rgba(0, 0, 0, 0.1)']);
  });

  it('reads a Tailwind config', () => {
    const tailwind = parseStyles(TAILWIND_CONFIG);
    expect(tailwind.colors).toEqual(expect.arrayContaining(['#7C3AED', '#0F172A', '#F8FAFC']));
    expect(tailwind.fonts).toEqual(['Inter', 'Cal Sans']);
    expect(tailwind.radii).toEqual(['1.25rem']);
    expect(tailwind.shadows).toEqual(['0 4px 24px rgba(15, 23, 42, 0.08)']);
  });

  it('reads shadcn/ui bare HSL variables', () => {
    const shadcn = parseStyles(SHADCN_GLOBALS);
    expect(shadcn.colors).toContain('#FFFFFF');
    expect(shadcn.colors.length).toBe(6);
    expect(shadcn.radii).toEqual(['0.5rem']);
  });

  it('reads an MUI theme', () => {
    expect(parseStyles(MUI_THEME).colors).toEqual(expect.arrayContaining(['#1976D2', '#D32F2F', '#FAFAFA']));
  });

  it('copes with nonsense, huge input and an unbalanced file', () => {
    expect(parseStyles('hello world').colors).toEqual([]);
    expect(parseStyles('').fonts).toEqual([]);
    expect(parseStyles('a { color: #fff; '.repeat(50_000)).colors).toEqual(['#FFFFFF']);
    expect(parseStyles('rgb(').colors).toEqual([]);
  });

  it('caps what it keeps, so share links stay short', () => {
    const many = Array.from({ length: 100 }, (_, i) => `#${String(i).padStart(6, '0')}`).join(' ');
    expect(parseStyles(many).colors).toHaveLength(24);
  });
});

describe('autoColorMap', () => {
  const invert = (colours: string[]) =>
    Object.entries(autoColorMap(colours)).reduce<Record<string, string[]>>((roles, [hex, role]) => {
      (roles[role] ??= []).push(hex);
      return roles;
    }, {});

  it('maps a real CSS file sensibly', () => {
    const map = autoColorMap(parseStyles(PLAIN_CSS).colors);
    expect(map['#6C5CE7']).toBe('accent');
    expect(map['#FFFFFF']).toBe('background');
    expect(map['#F1F1F1']).toBe('surface');
    expect(map['#DFE6E9']).toBe('border');
    expect(map['#D63031']).toBe('danger');
    expect(map['#00B894']).toBe('success');
    expect(map['#FDCB6E']).toBe('warning');
  });

  it('maps a real Tailwind config sensibly', () => {
    const map = autoColorMap(parseStyles(TAILWIND_CONFIG).colors);
    expect(map['#7C3AED']).toBe('accent');
    expect(map['#F8FAFC']).toBe('background');
    expect(map['#0F172A']).toBe('text');
    expect(map['#E2E8F0']).toBe('border');
    expect(map['#64748B']).toBe('text-muted');
  });

  it('maps every colour', () => {
    const colours = parseStyles(TAILWIND_CONFIG).colors;
    expect(Object.keys(autoColorMap(colours)).sort()).toEqual([...colours].sort());
  });

  it('spots a dark UI', () => {
    const roles = invert(['#121212', '#121212'.replace('2', '3'), '#FAFAFA', '#3B82F6']);
    expect(roles.background).toContain('#121212');
    expect(roles.text).toContain('#FAFAFA');
  });

  it('handles empty and single-colour input', () => {
    expect(autoColorMap([])).toEqual({});
    expect(Object.keys(autoColorMap(['#7C3AED']))).toHaveLength(1);
  });
});

describe('currentCssVars', () => {
  const restyle = {
    stylingSystem: 'tailwind',
    keep: ['functionality'],
    scope: 'retheme' as const,
    extracted: { colors: ['#7C3AED'], fonts: ['Poppins'], radii: ['20px'], shadows: ['0 4px 8px #0003'] },
    colorMap: { '#7C3AED': 'accent', '#101010': 'text' },
  };

  it('layers the old look over the new variables', () => {
    const vars = currentCssVars({ '--bb-color-accent': '#000000', '--bb-color-surface': '#FFFFFF' }, restyle);
    expect(vars['--bb-color-accent']).toBe('#7C3AED');
    expect(vars['--bb-color-text']).toBe('#101010');
    expect(vars['--bb-color-surface']).toBe('#FFFFFF');
    expect(vars['--bb-font-heading']).toContain('Poppins');
    expect(vars['--bb-radius-card']).toBe('20px');
    expect(vars['--bb-color-accent-foreground']).toBeTruthy();
  });

  it('does not change the original', () => {
    const original = { '--bb-color-accent': '#000000' };
    currentCssVars(original, restyle);
    expect(original['--bb-color-accent']).toBe('#000000');
  });
});

describe('quantize', () => {
  const pixels = (colours: number[][]) => new Uint8ClampedArray(colours.flat());
  const repeat = (colour: number[], times: number) => Array.from({ length: times }, () => colour);

  it('finds dominant colours, most common first', () => {
    const data = pixels([...repeat([255, 255, 255, 255], 70), ...repeat([31, 92, 69, 255], 30)]);
    const colours = quantize(data, 2);
    expect(colours[0]).toBe('#FFFFFF');
    expect(colours[1]).toBe('#1F5C45');
  });

  it('skips transparent pixels', () => {
    expect(quantize(pixels(repeat([255, 0, 0, 0], 10)))).toEqual([]);
  });

  it('handles a single flat colour', () => {
    expect(quantize(pixels(repeat([10, 20, 30, 255], 8)))).toEqual(['#0A141E']);
  });
});
