import { Check, X } from 'lucide-react';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { ACCENT_SWATCHES } from '@/tokens/defaults';
import { checkContrast } from '@/tokens/palette';
import type { DesignConfig } from '@/tokens/types';

function Swatches({ label, colours }: { label: string; colours: string[] }) {
  return (
    <div className="mb-4">
      <p className="mt-0 mb-1.5 text-sm text-muted">{label}</p>
      <div className="flex overflow-hidden rounded-button border border-line">
        {colours.map((colour, index) => (
          <span
            key={`${colour}-${index}`}
            title={colour}
            className="h-10 min-w-0 flex-1"
            style={{ backgroundColor: colour }}
          />
        ))}
      </div>
    </div>
  );
}

/** Live view of deriveTokens for reviewing Phase 2. Goes when the kit page does. */
export function KitTokens() {
  const { config, tokens, dispatch } = useConfig();
  const checks = checkContrast(tokens.colors);
  const failing = checks.filter((check) => !check.pass).length;

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

        <div className="flex flex-wrap gap-2">
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              aria-label={`Accent: ${swatch.name}`}
              aria-pressed={config.accent === swatch.hex}
              onClick={() => dispatch({ type: 'setAccent', accent: swatch.hex })}
              className="size-11 rounded-button border border-line aria-pressed:border-ink"
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>
        <p className="mt-3 mb-0 font-mono text-label text-muted">
          accent <output data-testid="accent">{config.accent}</output>
        </p>

        <ul className="mt-6 mb-4 list-none p-0">
          {checks.map((check) => (
            <li key={check.id} className="flex items-center gap-2 py-1 text-sm text-ink">
              {check.pass ? (
                <Check aria-hidden size={15} className="text-accent-ink" />
              ) : (
                <X aria-hidden size={15} className="text-muted" />
              )}
              <span className="flex-1">{check.label}</span>
              <span className="font-mono text-label text-muted">
                {check.ratio.toFixed(2)} {check.pass ? 'pass' : 'fail'}
              </span>
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          disabled={failing === 0}
          onClick={() => dispatch({ type: 'fixContrast' })}
        >
          {failing === 0 ? 'All pairs pass' : `Fix contrast (${failing})`}
        </Button>
      </div>

      <div>
        <Swatches label="Palette" colours={Object.values(tokens.colors)} />
        <Swatches label="Categorical" colours={tokens.data.categorical} />
        <Swatches label="Sequential" colours={tokens.data.sequential} />
        <Swatches label="Diverging" colours={tokens.data.diverging} />
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
