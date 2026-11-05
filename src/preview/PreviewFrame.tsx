import { Monitor, Play, Smartphone } from 'lucide-react';
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { useConfig } from '@/app/ConfigContext';
import { usePairingFonts } from '@/lib/fonts';
import { currentCssVars } from '@/restyle/currentStyle';
import { toCssVars } from '@/tokens/cssVars';
import { SCENE_FOR_PROJECT } from '@/tokens/defaults';
import { SCENES } from './scenes';
import { useRevealMotion } from './useRevealMotion';

export type PreviewDevice = 'desktop' | 'mobile';

/** The scene lays out at the real width, then scales down to fit the panel. */
const DEVICE_WIDTH: Record<PreviewDevice, number> = { desktop: 1200, mobile: 390 };

const INERT = { inert: '' } as HTMLAttributes<HTMLDivElement>;

function ToolButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-button text-muted transition-colors duration-150 hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink"
    >
      {children}
    </button>
  );
}

function useFitToWidth(width: number, isDesktop: boolean) {
  const port = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ portWidth: width, portHeight: 0, pageHeight: 0 });

  useEffect(() => {
    if (!port.current || !page.current) return;
    const observer = new ResizeObserver(() => {
      setSize({
        portWidth: port.current?.clientWidth ?? width,
        portHeight: port.current?.clientHeight ?? 0,
        pageHeight: page.current?.offsetHeight ?? 0,
      });
    });
    observer.observe(port.current);
    observer.observe(page.current);
    return () => observer.disconnect();
  }, [width]);

  // Never narrower than the device, but a roomy panel gets a roomier page.
  const pageWidth = isDesktop ? Math.max(width, size.portWidth) : width;
  const scale = Math.min(1, size.portWidth / pageWidth);
  return { port, page, scale, pageWidth, ...size };
}

export function PreviewFrame({ defaultDevice = 'desktop' }: { defaultDevice?: PreviewDevice }) {
  const { config, tokens } = useConfig();
  const [device, setDevice] = useState(defaultDevice);
  const [replay, setReplay] = useState(0);
  const [showCurrent, setShowCurrent] = useState(false);
  usePairingFonts([config.fontPairingId]);

  const width = DEVICE_WIDTH[device];
  const { port, page, scale, pageWidth, portHeight, pageHeight } = useFitToWidth(
    width,
    device === 'desktop',
  );
  useRevealMotion(page, tokens.motion, replay);

  // Variables update in place, so a change never re-mounts the scene.
  const canCompare = config.mode === 'restyle' && Boolean(config.restyle?.extracted);
  const style = useMemo(() => {
    const vars = toCssVars(tokens);
    const shown = canCompare && showCurrent && config.restyle ? currentCssVars(vars, config.restyle) : vars;
    return { ...shown, colorScheme: tokens.colorScheme } as CSSProperties;
  }, [canCompare, config.restyle, showCurrent, tokens]);
  const Scene = SCENES[SCENE_FOR_PROJECT[config.projectType]];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="m-0 text-sm font-medium text-ink">Live preview</p>
        <div className="flex items-center gap-1">
          {canCompare ? (
            <div className="mr-2 flex rounded-button border border-line p-0.5 text-sm">
              {[false, true].map((current) => (
                <button
                  key={String(current)}
                  type="button"
                  aria-pressed={showCurrent === current}
                  onClick={() => setShowCurrent(current)}
                  className="min-h-8 rounded-button px-2.5 text-muted aria-pressed:bg-surface aria-pressed:text-ink"
                >
                  {current ? 'Current' : 'New'}
                </button>
              ))}
            </div>
          ) : null}
          <ToolButton label="Replay motion" onClick={() => setReplay((count) => count + 1)}>
            <Play aria-hidden size={16} />
          </ToolButton>
          <ToolButton label="Desktop view" pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>
            <Monitor aria-hidden size={16} />
          </ToolButton>
          <ToolButton label="Mobile view" pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>
            <Smartphone aria-hidden size={16} />
          </ToolButton>
        </div>
      </div>

      <div
        ref={port}
        tabIndex={0}
        role="region"
        aria-label="Live preview of your style. Scroll to see more."
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-card border border-line bg-background"
      >
        <div style={{ height: pageHeight * scale, width: pageWidth * scale, margin: '0 auto' }}>
          <div
            {...INERT}
            ref={page}
            data-layout={config.layout}
            data-testid="preview-page"
            className="bb-texture @container grid origin-top-left bg-bb-background font-bb-body text-bb-2 leading-(--bb-line-height) text-bb-text"
            style={{
              ...style,
              width: pageWidth,
              minHeight: scale > 0 ? portHeight / scale : portHeight,
              transform: `scale(${scale})`,
            }}
          >
            <Suspense fallback={null}>
              <Scene config={config} tokens={tokens} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
