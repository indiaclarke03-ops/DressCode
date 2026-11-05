import type { ReactNode } from 'react';

interface BoxProps {
  children?: ReactNode;
  className?: string;
}

/** A card. `data-reveal` joins it to the motion replay. */
export function Panel({ children, className = '' }: BoxProps) {
  return (
    <div
      data-reveal
      className={`rounded-bb-card border-(length:--bb-border-width) border-bb-border bg-bb-surface shadow-bb-card ${className}`}
    >
      {children}
    </div>
  );
}

const HEADING = 'm-0 font-bb-heading leading-tight font-(--bb-font-weight-heading) text-bb-text';

export function Display({ children, className = '' }: BoxProps) {
  return <h1 className={`${HEADING} text-bb-7 ${className}`}>{children}</h1>;
}

export function Title({ children, className = '' }: BoxProps) {
  return <h2 className={`${HEADING} text-bb-5 ${className}`}>{children}</h2>;
}

export function Subtitle({ children, className = '' }: BoxProps) {
  return <h3 className={`${HEADING} text-bb-3 ${className}`}>{children}</h3>;
}

export function Text({ children, className = '' }: BoxProps) {
  return <p className={`m-0 text-bb-2 text-bb-text ${className}`}>{children}</p>;
}

export function Muted({ children, className = '' }: BoxProps) {
  return <p className={`m-0 text-bb-1 text-bb-muted ${className}`}>{children}</p>;
}

export function Figure({ children, className = '' }: BoxProps) {
  return (
    <p className={`m-0 font-bb-mono text-bb-5 leading-tight text-bb-text tabular-nums ${className}`}>
      {children}
    </p>
  );
}

export type ButtonStyle = 'solid' | 'outlined' | 'text-with-arrow';

const BUTTONS: Record<ButtonStyle, string> = {
  solid: 'bg-bb-accent text-bb-on-accent',
  outlined: 'border border-bb-accent text-bb-accent',
  'text-with-arrow': 'text-bb-accent underline underline-offset-4',
};

export function Btn({ children, kind = 'solid', className = '' }: BoxProps & { kind?: ButtonStyle }) {
  return (
    <span
      className={`inline-flex min-h-bb-control items-center gap-1 rounded-bb-control px-bb-3 text-bb-2 font-medium whitespace-nowrap ${kind === 'text-with-arrow' ? 'px-0' : ''} ${BUTTONS[kind]} ${className}`}
    >
      {children}
      {kind === 'text-with-arrow' ? <span aria-hidden>→</span> : null}
    </span>
  );
}

export type FieldStyle = 'outlined' | 'filled' | 'underline';

const FIELDS: Record<FieldStyle, string> = {
  outlined: 'rounded-bb-control border border-bb-border bg-bb-surface',
  filled: 'rounded-bb-control bg-bb-background',
  underline: 'border-b border-bb-text',
};

export function Field({ label, value, kind = 'outlined' }: { label: string; value: string; kind?: FieldStyle }) {
  return (
    <div>
      <Muted className="mb-1">{label}</Muted>
      <div className={`flex min-h-bb-control items-center px-bb-2 text-bb-2 text-bb-text ${FIELDS[kind]}`}>
        {value}
      </div>
    </div>
  );
}

export function Switch({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between gap-bb-3 py-bb-1">
      <Text>{label}</Text>
      <span className={`flex h-5 w-9 shrink-0 rounded-full p-0.5 ${on ? 'justify-end bg-bb-accent' : 'bg-bb-border'}`}>
        <span className="block size-4 rounded-full bg-bb-raised" />
      </span>
    </div>
  );
}

export function Tag({ children, tone = 'muted' }: BoxProps & { tone?: 'muted' | 'accent' }) {
  const colour = tone === 'accent' ? 'text-bb-accent border-bb-accent' : 'text-bb-muted border-bb-border';
  return (
    <span className={`inline-block rounded-bb-control border px-bb-1 text-bb-1 whitespace-nowrap ${colour}`}>
      {children}
    </span>
  );
}

/** Sidebars hide on phones, so the brand moves to a slim bar instead. */
export function MobileBrand({ brand }: { brand: string }) {
  return (
    <div className="border-b border-bb-border px-bb-4 py-bb-2 @3xl:hidden">
      <Subtitle>{brand}</Subtitle>
    </div>
  );
}

export function NavItem({ children, active = false }: BoxProps & { active?: boolean }) {
  return (
    <span
      className={`block rounded-bb-control px-bb-2 py-bb-1 text-bb-2 ${active ? 'bg-bb-background font-medium text-bb-accent' : 'text-bb-muted'}`}
    >
      {children}
    </span>
  );
}

const PICTURES = [
  /* Horizon bands */
  <>
    <rect y="96" width="400" height="60" className="fill-bb-emphasis-2" />
    <rect y="156" width="400" height="84" className="fill-bb-emphasis-1" />
  </>,
  /* Overlapping arcs */
  <>
    <circle cx="150" cy="240" r="150" className="fill-bb-emphasis-2" />
    <circle cx="280" cy="240" r="96" className="fill-bb-emphasis-1" />
  </>,
  /* Offset blocks */
  <>
    <rect x="48" y="40" width="150" height="200" className="fill-bb-emphasis-1" />
    <rect x="198" y="100" width="154" height="140" className="fill-bb-emphasis-2" />
  </>,
  /* Diagonal field */
  <>
    <path d="M0 240 400 40v200z" className="fill-bb-emphasis-2" />
    <path d="M160 240 400 120v120z" className="fill-bb-emphasis-1" />
  </>,
];

/** An abstract composition in the palette. Stands in for imagery; no stock art. */
export function Picture({ className = '', label }: BoxProps & { label: string }) {
  const index = [...label].reduce((total, char) => total + char.charCodeAt(0), 0);
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMax slice"
      className={`block w-full ${className}`}
    >
      <rect width="400" height="240" className="fill-bb-emphasis-3" />
      {PICTURES[index % PICTURES.length]}
    </svg>
  );
}
