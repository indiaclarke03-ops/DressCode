import { useCallback, useEffect, useState } from 'react';
import { nextTheme, readStoredTheme, resolveTheme, storeTheme, type Theme } from './theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    resolveTheme(readStoredTheme(), window.matchMedia(DARK_QUERY).matches),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = nextTheme(theme);
    storeTheme(next);
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
