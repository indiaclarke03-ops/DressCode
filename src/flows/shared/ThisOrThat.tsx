import { m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from '@/app/ConfigContext';
import { configReducer, type ConfigAction } from '@/app/configReducer';
import { Button } from '@/components/ui/Button';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { DEMOS } from '@/preview/demos';
import { LayoutStrip, MotionStrip } from '@/preview/demos/RoundExtras';
import { TokenScope } from '@/preview/demos/TokenScope';
import { SCENE_FOR_PROJECT } from '@/tokens/defaults';
import type { ChoiceKey, Choices, DesignConfig } from '@/tokens/types';
import { ROUNDS, type Round, type RoundOption } from './rounds';

/** Long enough to see your choice land before the next round. */
const ADVANCE_DELAY_MS = 220;

const setChoice = (key: ChoiceKey, value: string): ConfigAction => ({
  type: 'set',
  patch: { [key]: value } as Partial<Choices>,
});

function RoundOptionCard({ round, option, config }: { round: Round; option: RoundOption; config: DesignConfig }) {
  const variant = configReducer(config, setChoice(round.key, option.value));
  const Demo = DEMOS[SCENE_FOR_PROJECT[config.projectType]];

  return (
    <ChoiceCard
      value={option.value}
      title={option.label}
      illustration={
        <TokenScope config={variant}>
          {round.key === 'layout' ? <LayoutStrip kind={variant.layout} /> : <Demo />}
          {round.key === 'motion' ? <MotionStrip /> : null}
        </TokenScope>
      }
    />
  );
}

export function ThisOrThat({ onDone }: { onDone: () => void }) {
  const { config, dispatch } = useConfig();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Partial<Record<ChoiceKey, string>>>({});
  const timer = useRef<number | undefined>(undefined);
  const heading = useRef<HTMLHeadingElement>(null);
  const round = ROUNDS[index] ?? ROUNDS[0];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (index > 0) heading.current?.focus({ preventScroll: true });
  }, [index]);

  const advance = useCallback(() => {
    timer.current = undefined;
    if (index + 1 < ROUNDS.length) setIndex(index + 1);
    else onDone();
  }, [index, onDone]);

  const pick = useCallback(
    (value: string) => {
      if (!round || timer.current !== undefined) return;
      dispatch(setChoice(round.key, value));
      setPicked((current) => ({ ...current, [round.key]: value }));
      timer.current = window.setTimeout(advance, ADVANCE_DELAY_MS);
    },
    [advance, dispatch, round],
  );

  const skip = useCallback(() => {
    if (!round || timer.current !== undefined) return;
    dispatch({ type: 'noPreference', key: round.key });
    setPicked(({ [round.key]: _cleared, ...rest }) => rest);
    advance();
  }, [advance, dispatch, round]);

  useEffect(() => {
    if (!round) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key !== 'arrowleft' && key !== 'arrowright' && key !== 'n') return;
      // Capture phase: otherwise the radio group also treats the arrows as its own.
      event.preventDefault();
      event.stopPropagation();
      if (key === 'n') skip();
      else pick(key === 'arrowleft' ? round.a.value : round.b.value);
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [pick, round, skip]);

  if (!round) return null;
  const current = picked[round.key];

  return (
    <m.div
      key={round.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <p className="m-0 font-mono text-label text-muted">
        Round {index + 1} of {ROUNDS.length}
      </p>
      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-2 mb-0 font-display text-heading font-normal text-ink outline-none"
      >
        {round.title}
      </h2>
      <p className="mt-2 mb-5 text-muted">{round.explanation}</p>

      <ChoiceGroup
        label={round.title}
        value={current ?? ''}
        onValueChange={pick}
        className="grid gap-4 md:grid-cols-2"
      >
        <RoundOptionCard round={round} option={round.a} config={config} />
        <RoundOptionCard round={round} option={round.b} config={config} />
      </ChoiceGroup>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {index > 0 ? (
          <Button variant="ghost" className="-ml-4" onClick={() => setIndex(index - 1)}>
            Previous round
          </Button>
        ) : null}
        <Button variant="secondary" onClick={skip}>
          No preference
        </Button>
        {current ? (
          <Button variant="secondary" onClick={advance}>
            Next round
          </Button>
        ) : null}
        <p className="m-0 ml-auto hidden font-mono text-label text-muted lg:block">
          Left and right arrow keys to choose, N for no preference
        </p>
      </div>
    </m.div>
  );
}
