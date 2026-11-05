import { useEffect, useState } from 'react';

const REPLAY_MS = 1800;
const BARS = [0, 1, 2, 3, 4, 5];

/** Motion can't be judged from a still, so these bars keep replaying it. */
export function MotionStrip() {
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setRaised((value) => !value), REPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="flex h-12 w-full items-end gap-1.5">
      {BARS.map((bar) => (
        <span
          key={bar}
          className="block h-full flex-1 origin-bottom bg-bb-accent transition-transform duration-(--bb-duration) ease-(--bb-easing)"
          style={{
            transform: `scaleY(${raised ? 1 : 0.3})`,
            transitionDelay: `calc(var(--bb-stagger) * ${bar})`,
          }}
        />
      ))}
    </span>
  );
}

/** A page sketch, because layout only shows up at page scale. */
export function LayoutStrip({ kind }: { kind: 'grid' | 'editorial' }) {
  const block = 'block bg-bb-border';
  if (kind === 'grid') {
    return (
      <span className="grid w-full grid-cols-3 gap-2">
        <span className={`${block} col-span-3 h-5`} />
        <span className={`${block} h-14`} />
        <span className={`${block} h-14`} />
        <span className={`${block} h-14`} />
      </span>
    );
  }
  return (
    <span className="grid w-full grid-cols-6 gap-2">
      <span className={`${block} col-span-4 col-start-2 h-5`} />
      <span className="col-span-4 block h-14 bg-bb-accent" />
      <span className={`${block} col-span-2 mt-5 h-9`} />
    </span>
  );
}
