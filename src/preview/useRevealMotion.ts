import { useEffect, type RefObject } from 'react';
import type { DesignTokens } from '@/tokens/deriveTokens';

const REVEAL_DISTANCE_PX = 16;

/** Motion is invisible in a still page, so play it whenever it changes or on request. */
export function useRevealMotion(
  root: RefObject<HTMLElement>,
  motion: DesignTokens['motion'],
  replay: number,
): void {
  useEffect(() => {
    const isFirstRun = replay === 0 && !root.current?.dataset.revealed;
    if (root.current) root.current.dataset.revealed = 'true';
    if (isFirstRun) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const offset = motion.spring ? REVEAL_DISTANCE_PX : 0;
    root.current?.querySelectorAll('[data-reveal]').forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: `translateY(${offset}px)` },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: motion.durationMs,
          easing: motion.easing,
          delay: index * motion.staggerMs,
          fill: 'backwards',
        },
      );
    });
  }, [motion, replay, root]);
}
