import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex size-11 items-center justify-center rounded-button text-muted transition-colors duration-150 hover:text-ink"
    >
      <Icon aria-hidden size={18} />
    </button>
  );
}
