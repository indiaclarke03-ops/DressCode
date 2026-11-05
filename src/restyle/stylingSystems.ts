export const STYLING_SYSTEMS = [
  { id: 'css', label: 'Plain CSS', location: 'your CSS files', tokenHome: 'CSS variables' },
  { id: 'tailwind', label: 'Tailwind', location: 'your Tailwind config and class names', tokenHome: 'Tailwind theme' },
  { id: 'css-modules', label: 'CSS Modules', location: 'your .module.css files', tokenHome: 'CSS variables' },
  { id: 'styled-components', label: 'styled-components', location: 'your styled components', tokenHome: 'theme file' },
  { id: 'sass', label: 'Sass', location: 'your .scss files and variables', tokenHome: 'CSS variables' },
  { id: 'mui', label: 'MUI', location: 'your MUI theme and sx props', tokenHome: 'theme file' },
  { id: 'shadcn', label: 'shadcn/ui', location: 'your globals.css variables and Tailwind config', tokenHome: 'CSS variables' },
  { id: 'bootstrap', label: 'Bootstrap', location: 'your Bootstrap variables and overrides', tokenHome: 'CSS variables' },
  { id: 'chakra', label: 'Chakra', location: 'your Chakra theme', tokenHome: 'theme file' },
  { id: 'streamlit', label: 'Streamlit', location: 'your .streamlit/config.toml and custom CSS', tokenHome: 'theme file' },
  { id: 'unknown', label: 'Not sure', location: 'the project', tokenHome: 'CSS variables' },
] as const;

export function stylingSystem(id: string) {
  return STYLING_SYSTEMS.find((system) => system.id === id) ?? STYLING_SYSTEMS[10];
}
