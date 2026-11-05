import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

/** Marks a round answered with "No preference", as distinct from unanswered. */
const NO_PREFERENCE = 'no-preference';

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
          {round.key === 'layout' ? (
            <LayoutStrip kind={variant.layout} />
          ) : (
            <Demo projectType={config.projectType} />
          )}
          {round.key === 'motion' ? <MotionStrip /> : null}
        </TokenScope>
      }
    />
  );
}

export function ThisOrThat({ onDone }: { onDone: () => void }) {
  const { config, dispatch } = useConfig();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<ChoiceKey, string>>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const round = ROUNDS[index] ?? ROUNDS[0];
  const answer = round ? answers[round.key] : undefined;

  useEffect(() => {
    if (index > 0) heading.current?.focus({ preventScroll: true });
  }, [index]);

  const advance = useCallback(() => {
    if (index + 1 < ROUNDS.length) setIndex(index + 1);
    else onDone();
  }, [index, onDone]);

  const pick = useCallback(
    (value: string) => {
      if (!round) return;
      dispatch(setChoice(round.key, value));
      setAnswers((current) => ({ ...current, [round.key]: value }));
    },
    [dispatch, round],
  );

  const skip = useCallback(() => {
    if (!round) return;
    dispatch({ type: 'noPreference', key: round.key });
    setAnswers((current) => ({ ...current, [round.key]: NO_PREFERENCE }));
  }, [dispatch, round]);

  useEffect(() => {
    if (!round) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();

      if (key === 'enter') {
        const onOtherControl =
          event.target instanceof HTMLElement &&
          event.target.closest('a, button:not([role="radio"])') !== null;
        if (answer && !onOtherControl) {
          event.preventDefault();
          advance();
        }
        return;
      }

      const digit = Number(key);
      const isDigit = digit >= 1 && digit <= round.options.length;
      if (key !== 'arrowleft' && key !== 'arrowright' && key !== 'n' && !isDigit) return;
      // Capture phase: otherwise the radio group also treats the arrows as its own.
      event.preventDefault();
      event.stopPropagation();
      if (key === 'n') {
        skip();
        return;
      }
      const values = round.options.map((option) => option.value);
      const position = values.indexOf(answer ?? '');
      const step = key === 'arrowleft' ? values.length - 1 : 1;
      const next = isDigit ? digit - 1 : (Math.max(position, key === 'arrowleft' ? 0 : -1) + step) % values.length;
      const value = values[next];
      if (value) pick(value);
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [advance, answer, pick, round, skip]);

  if (!round) return null;
  const isLastRound = index + 1 === ROUNDS.length;

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
        value={answer === NO_PREFERENCE ? '' : (answer ?? '')}
        onValueChange={pick}
        className="grid gap-4 @xl:grid-cols-2"
      >
        {round.options.map((option) => (
          <RoundOptionCard key={option.value} round={round} option={option} config={config} />
        ))}
      </ChoiceGroup>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {index > 0 ? (
          <Button variant="ghost" className="-ml-4" onClick={() => setIndex(index - 1)}>
            Previous round
          </Button>
        ) : null}
        <Button variant="secondary" aria-pressed={answer === NO_PREFERENCE} onClick={skip} className="aria-pressed:border-accent">
          No preference
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Skip the rest
        </Button>
        <Button className="ml-auto" disabled={!answer} onClick={advance}>
          {isLastRound ? 'Continue' : 'Next round'}
          <ArrowRight aria-hidden size={16} />
        </Button>
      </div>
      <p className="mt-3 mb-0 hidden text-right font-mono text-label text-muted lg:block">
        Number keys or arrows to choose, N for no preference, Enter to move on
      </p>
    </m.div>
  );
}
