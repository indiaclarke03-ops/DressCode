const SWATCHES = [
  { x: 392, tone: 'fill-ink' },
  { x: 436, tone: 'fill-accent' },
  { x: 480, tone: 'fill-line-strong' },
  { x: 524, tone: 'fill-line' },
];

const CONNECTORS = ['M352 118h32', 'M352 222h32', 'M352 322h32'];

/** A blank page taking shape, with the tokens that define it alongside. */
export function FreshIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 600 440" className="mt-auto block w-full">
      <g className="fill-none stroke-line-strong" strokeWidth="1.25">
        <rect x="36" y="36" width="316" height="430" rx="6" className="fill-background" />
        <path d="M36 76h316" />
      </g>
      <text x="64" y="164" className="fill-ink font-display" fontSize="68">
        Aa
      </text>
      <g className="fill-line">
        <rect x="64" y="190" width="260" height="9" rx="1" />
        <rect x="64" y="212" width="216" height="9" rx="1" />
        <rect x="64" y="234" width="240" height="9" rx="1" />
      </g>
      <rect x="64" y="270" width="112" height="38" rx="4" className="fill-accent" />
      <rect x="188" y="270" width="88" height="38" rx="4" className="fill-none stroke-line-strong" />
      <rect x="64" y="340" width="260" height="130" rx="4" className="fill-surface stroke-line" />
      <rect x="84" y="362" width="96" height="9" rx="1" className="fill-line-strong" />
      <rect x="84" y="384" width="180" height="7" rx="1" className="fill-line" />

      {CONNECTORS.map((d) => (
        <path key={d} d={d} className="fill-none stroke-line-strong" strokeDasharray="3 4" />
      ))}

      <g className="fill-muted font-mono" fontSize="14">
        <text x="392" y="80">
          colour
        </text>
        <text x="392" y="186">
          type
        </text>
        <text x="392" y="290">
          radius
        </text>
      </g>
      {SWATCHES.map((swatch) => (
        <rect
          key={swatch.x}
          x={swatch.x}
          y="92"
          width="38"
          height="56"
          rx="3"
          className={swatch.tone}
        />
      ))}
      <text x="392" y="238" className="fill-ink font-display" fontSize="40">
        Aa
      </text>
      <text x="452" y="238" className="fill-ink font-sans" fontSize="34">
        Aa
      </text>
      <text x="512" y="236" className="fill-ink font-mono" fontSize="28">
        12
      </text>
      <g className="fill-none stroke-line-strong" strokeWidth="1.5">
        <path d="M392 346v-30a4 4 0 0 1 4-4h26" />
        <path d="M452 346v-20a14 14 0 0 1 14-14h16" />
        <path d="M512 346v-8a26 26 0 0 1 26-26h4" />
      </g>
    </svg>
  );
}

function RestylePage({ x, muted }: { x: number; muted: boolean }) {
  return (
    <g transform={`translate(${x} 24)`}>
      <rect width="176" height="140" rx="5" className="fill-background stroke-line-strong" />
      <rect x="16" y="20" width="84" height="9" rx="1" className={muted ? 'fill-line' : 'fill-ink'} />
      <rect x="16" y="40" width="136" height="6" rx="1" className="fill-line" />
      <rect x="16" y="54" width="112" height="6" rx="1" className="fill-line" />
      <rect
        x="16"
        y="78"
        width="64"
        height="24"
        rx={muted ? 12 : 3}
        className={muted ? 'fill-line-strong' : 'fill-accent'}
      />
    </g>
  );
}

/** The same page, before and after. */
export function RestyleIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 440 150" className="mt-auto block w-full">
      <RestylePage x={24} muted />
      <path
        d="M206 88h28m-7-6 7 6-7 6"
        className="fill-none stroke-accent"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <RestylePage x={240} muted={false} />
    </svg>
  );
}

/** One control nudged, one line of prompt out. */
export function TweakIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 440 150" className="mt-auto block w-full">
      <path d="M24 56h392" className="stroke-line-strong" strokeWidth="2" />
      <path d="M24 56h224" className="stroke-accent" strokeWidth="2" />
      <circle cx="248" cy="56" r="9" className="fill-surface stroke-accent" strokeWidth="2" />
      <text x="24" y="110" className="fill-muted font-mono" fontSize="14">
        Change the accent to
      </text>
      <rect x="216" y="97" width="16" height="16" rx="2" className="fill-accent" />
      <text x="240" y="110" className="fill-ink font-mono" fontSize="14">
        #C2552D
      </text>
    </svg>
  );
}
