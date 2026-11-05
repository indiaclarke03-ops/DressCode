import { useEffect, useState } from 'react';
import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { TextInput } from '@/components/ui/TextInput';
import { normalizeHex } from '@/tokens/color';
import type { DesignConfig } from '@/tokens/types';
import { ContrastChecklist } from './ContrastChecklist';
import { CurrentPalette } from './CurrentVsNew';
import { PaletteStrip } from './PaletteStrip';
import { SwatchPicker } from './SwatchPicker';

const SECTION_HEADING = 'mt-0 mb-3 text-sm font-medium text-ink';

function CustomHex() {
  const { config, dispatch } = useConfig();
  const [draft, setDraft] = useState(config.accent);

  useEffect(() => setDraft(config.accent), [config.accent]);

  const isValid = normalizeHex(draft) !== null;

  return (
    <label className="mt-4 block max-w-56 text-sm text-muted">
      Or enter a colour code (hex)
      <TextInput
        className="mt-1.5 font-mono"
        spellCheck={false}
        maxLength={7}
        aria-invalid={!isValid}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          dispatch({ type: 'setAccent', accent: event.target.value });
        }}
      />
      {isValid ? null : <span className="mt-1 block">Use a format like #1F5C45.</span>}
    </label>
  );
}

export function Colour() {
  const { config, tokens, dispatch } = useConfig();

  return (
    <div className="grid gap-10 @3xl:grid-cols-2">
      <div className="flex flex-col gap-8">
        <section>
          <h2 className={SECTION_HEADING}>Main colour</h2>
          <SwatchPicker
            value={config.accent}
            onChange={(accent) => dispatch({ type: 'setAccent', accent })}
          />
          <CustomHex />
          {config.colorStrategy === 'monochrome' ? (
            <p className="mt-3 mb-0 max-w-md text-sm text-muted">
              You chose black and white, so this colour isn't shown. Pick another option in This or
              that to bring it back.
            </p>
          ) : null}
        </section>

        <section>
          <h2 className={SECTION_HEADING}>Background tone</h2>
          <ChoiceGroup
            label="Background tone"
            value={config.neutral}
            onValueChange={(value) =>
              dispatch({ type: 'set', patch: { neutral: value as DesignConfig['neutral'] } })
            }
            className="grid grid-cols-3 gap-3"
          >
            <ChoiceCard value="cool" title="Cool" />
            <ChoiceCard value="warm" title="Warm" />
            <ChoiceCard value="neutral" title="Neutral" />
          </ChoiceGroup>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <CurrentPalette />
        <PaletteStrip label="Your palette" colours={Object.values(tokens.colors)} />
        {tokens.includeDataPalette ? (
          <>
            <PaletteStrip label="Chart colours" colours={tokens.data.categorical} />
            <PaletteStrip label="Low to high" colours={tokens.data.sequential} />
            <PaletteStrip label="Above and below a midpoint" colours={tokens.data.diverging} />
          </>
        ) : null}
        <section>
          <h2 className={SECTION_HEADING}>Is it readable?</h2>
          <ContrastChecklist />
        </section>
      </div>
    </div>
  );
}
