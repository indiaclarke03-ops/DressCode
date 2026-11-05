import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { ContrastChecklist } from '@/flows/shared/ContrastChecklist';
import { PaletteStrip } from '@/flows/shared/PaletteStrip';
import { SwatchPicker } from '@/flows/shared/SwatchPicker';
import type { DesignConfig } from '@/tokens/types';

/** Live view of deriveTokens for reviewing Phase 2. Goes when the kit page does. */
export function KitTokens() {
  const { config, tokens, dispatch } = useConfig();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <ChoiceGroup
          label="Theme"
          value={config.theme}
          onValueChange={(value) =>
            dispatch({ type: 'set', patch: { theme: value as DesignConfig['theme'] } })
          }
          className="mb-5 grid grid-cols-2 gap-3"
        >
          <ChoiceCard value="light" title="Light" />
          <ChoiceCard value="dark" title="Dark" />
        </ChoiceGroup>

        <ChoiceGroup
          label="Neutral temperature"
          value={config.neutral}
          onValueChange={(value) =>
            dispatch({ type: 'set', patch: { neutral: value as DesignConfig['neutral'] } })
          }
          className="mb-5 grid grid-cols-3 gap-3"
        >
          <ChoiceCard value="cool" title="Cool" />
          <ChoiceCard value="warm" title="Warm" />
          <ChoiceCard value="neutral" title="True" />
        </ChoiceGroup>

        <SwatchPicker
          value={config.accent}
          onChange={(accent) => dispatch({ type: 'setAccent', accent })}
        />
        <p className="mt-3 mb-0 font-mono text-label text-muted">
          accent <output data-testid="accent">{config.accent}</output>
        </p>

        <div className="mt-6">
          <ContrastChecklist />
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4">
          <PaletteStrip label="Palette" colours={Object.values(tokens.colors)} />
          <PaletteStrip label="Categorical" colours={tokens.data.categorical} />
          <PaletteStrip label="Sequential" colours={tokens.data.sequential} />
          <PaletteStrip label="Diverging" colours={tokens.data.diverging} />
        </div>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-label text-muted">
          <dt>type</dt>
          <dd className="m-0 text-ink">{tokens.type.sizes.join(' / ')}</dd>
          <dt>space</dt>
          <dd className="m-0 text-ink">{tokens.spacing.join(', ')}</dd>
          <dt>radius</dt>
          <dd className="m-0 text-ink">
            {tokens.radius.control}px control, {tokens.radius.card}px card
          </dd>
          <dt>fonts</dt>
          <dd className="m-0 text-ink">{tokens.fonts.pairingName}</dd>
        </dl>
      </div>
    </div>
  );
}
