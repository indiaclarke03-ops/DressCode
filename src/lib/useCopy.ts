import { useCallback, useEffect, useRef, useState } from 'react';

const COPIED_MS = 1800;

/** Returns `copied` so the button can confirm, or `failed` when the browser refuses. */
export function useCopy() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), COPIED_MS);
  }, []);

  return { copy, copied: status === 'copied', failed: status === 'failed' };
}
