import type { ReactNode } from 'react';

/** Spans throughout: demos sit inside choice-card buttons, which allow phrasing content only. */
export function DemoCard({ children }: { children: ReactNode }) {
  return (
    <span className="block w-full rounded-bb-card border-(length:--bb-border-width) border-bb-border bg-bb-surface p-(--bb-space-4) shadow-bb-card">
      {children}
    </span>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <span className="block font-bb-heading text-(length:--bb-text-5) leading-tight font-(--bb-font-weight-heading) text-bb-text">
      {children}
    </span>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  return <span className="block text-(length:--bb-text-1) text-bb-muted">{children}</span>;
}

export function Figure({ children }: { children: ReactNode }) {
  return (
    <span className="block font-bb-mono text-(length:--bb-text-6) leading-tight text-bb-text tabular-nums">
      {children}
    </span>
  );
}

export function SolidButton({ children }: { children: ReactNode }) {
  return (
    <span className="mt-(--bb-space-2) inline-block rounded-bb-control bg-bb-accent px-(--bb-space-3) py-(--bb-space-1) text-bb-on-accent">
      {children}
    </span>
  );
}

const EMPHASIS_BARS = [
  { height: 'h-6', tone: 'bg-bb-emphasis-1' },
  { height: 'h-9', tone: 'bg-bb-emphasis-2' },
  { height: 'h-4', tone: 'bg-bb-emphasis-3' },
  { height: 'h-10', tone: 'bg-bb-emphasis-1' },
  { height: 'h-7', tone: 'bg-bb-emphasis-2' },
];

export function EmphasisBars() {
  return (
    <span className="mt-(--bb-space-2) flex items-end gap-1">
      {EMPHASIS_BARS.map((bar, index) => (
        <span key={index} className={`block flex-1 ${bar.height} ${bar.tone}`} />
      ))}
    </span>
  );
}
