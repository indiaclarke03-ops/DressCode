import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { REPO_URL } from '@/lib/links';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

export function SiteLayout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  // The flows run wider, to fit the preview. The header and footer line up with them.
  const width = /^\/(fresh|restyle)(\/|$)/.test(pathname) ? 'max-w-flow' : 'max-w-page';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <button
        type="button"
        onClick={() => main.current?.focus()}
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded-button focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </button>

      <header className="border-b border-line">
        <div className={`mx-auto flex h-16 ${width} items-center justify-between px-4 md:px-8`}>
          <Link to="/" className="-ml-1 flex items-center gap-2 rounded-button p-1">
            <Logo />
            <span className="font-display text-2xl leading-none text-ink">Dress Code</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-2">
            <Link
              to="/examples"
              className="rounded-button px-2 py-2 text-sm text-muted transition-colors duration-150 hover:text-ink"
            >
              Examples
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main ref={main} tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className={`mx-auto flex ${width} flex-col gap-2 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8`}>
          <p className="m-0 flex gap-4">
            <span className="text-ink">Dress Code</span>
            <a href={REPO_URL} className="underline underline-offset-4 hover:text-ink">
              GitHub
            </a>
          </p>
          <p className="m-0">Everything runs in your browser. Nothing you paste is uploaded.</p>
        </div>
      </footer>
    </div>
  );
}
