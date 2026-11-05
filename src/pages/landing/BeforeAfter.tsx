import { ArrowDownRight, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

function Specimen({ tag, brief, children }: { tag: string; brief: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-3">
      <figcaption>
        <span className="block text-sm font-medium text-ink">{tag}</span>
        <span className="mt-0.5 block font-mono text-label text-muted">{brief}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function GenericCard() {
  return (
    <div className="flex-1 overflow-hidden rounded-specimen-generic bg-generic-surface text-center shadow-generic">
      <div className="flex h-24 items-center justify-center bg-linear-to-r from-generic-from to-generic-to">
        <span className="flex size-12 items-center justify-center rounded-full bg-generic-surface text-generic-from">
          <Sparkles aria-hidden size={22} />
        </span>
      </div>
      <div className="px-5 pt-5 pb-6">
        <p className="m-0 text-lg font-bold text-generic-ink">Welcome to Your Energy Hub</p>
        <p className="mt-2 mb-0 text-sm text-generic-muted">
          Unlock powerful insights and take control today.
        </p>
        <p className="mt-4 mb-0 text-3xl font-extrabold text-generic-ink">1,284 kWh</p>
        <span className="mt-5 block rounded-full bg-linear-to-r from-generic-from to-generic-to py-2.5 text-sm font-semibold text-generic-surface">
          Get Started
        </span>
      </div>
    </div>
  );
}

const BARS = [
  { x: 0, height: 34 },
  { x: 20, height: 26 },
  { x: 40, height: 40 },
  { x: 60, height: 30 },
  { x: 80, height: 36 },
];

function BriefCard() {
  return (
    <div className="flex flex-1 flex-col rounded-specimen-brief border border-brief-line bg-brief-surface p-5 text-left">
      <p className="m-0 text-sm text-brief-muted">Grid usage, October</p>
      <p className="mt-1 mb-0 font-mono text-3xl font-medium tracking-tight text-brief-ink tabular-nums">
        1,284 <span className="font-sans text-base text-brief-muted">kWh</span>
      </p>
      <p className="mt-1 mb-0 flex items-center gap-1 text-sm text-brief-accent">
        <ArrowDownRight aria-hidden size={15} />
        8.2% lower than September
      </p>
      <svg
        aria-hidden
        viewBox="0 0 114 44"
        preserveAspectRatio="none"
        className="mt-5 block min-h-16 w-full flex-1"
      >
        {BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={44 - bar.height}
            width="14"
            height={bar.height}
            className="fill-brief-accent-soft"
          />
        ))}
        <rect x="100" y="20" width="14" height="24" className="fill-brief-accent" />
      </svg>
      <div className="mt-4 flex items-center justify-between border-t border-brief-line pt-4">
        <span className="text-sm text-brief-muted">6 months</span>
        <span className="rounded-specimen-control bg-brief-accent px-3 py-1.5 text-sm font-medium text-brief-surface">
          View breakdown
        </span>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 sm:gap-5">
      <Specimen tag="Vague brief" brief={'"Make it modern and clean."'}>
        <GenericCard />
      </Specimen>
      <Specimen tag="Dress Code brief" brief="#1F5C45, 6px radius, no shadows">
        <BriefCard />
      </Specimen>
    </div>
  );
}
