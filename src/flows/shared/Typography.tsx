import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { usePairingFonts } from '@/lib/fonts';
import { TYPE_RATIO, typeSizes } from '@/tokens/deriveTokens';
import { FONT_PAIRINGS, type FontPairing } from '@/tokens/fontPairings';
import type { DesignConfig } from '@/tokens/types';

const SECTION_HEADING = 'mt-0 mb-3 text-sm font-medium text-ink';
const stack = (role: FontPairing['heading']) => `'${role.family}', ${role.fallback}`;

function Specimen({ pairing }: { pairing: FontPairing }) {
  const body = { fontFamily: stack(pairing.body), fontWeight: pairing.body.weight };
  return (
    <span className="block">
      <span
        className="block text-2xl/tight text-ink"
        style={{ fontFamily: stack(pairing.heading), fontWeight: pairing.heading.weight }}
      >
        Energy prices fell again
      </span>
      <span className="mt-2 block text-sm/6 text-muted" style={body}>
        Wholesale gas dropped for the third month, easing bills across the region.
      </span>
      <span className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-label text-muted" style={body}>
          Average tariff
        </span>
        <span className="text-lg text-ink tabular-nums" style={{ fontFamily: stack(pairing.mono) }}>
          24.5p/kWh
        </span>
      </span>
    </span>
  );
}

const SCALES: { id: DesignConfig['typeScale']; title: string; description: string }[] = [
  { id: 'tight', title: 'Tight', description: 'Sizes stay close. Suits dense screens.' },
  { id: 'balanced', title: 'Balanced', description: 'Clear steps. Works almost anywhere.' },
  { id: 'dramatic', title: 'Dramatic', description: 'Big headlines. Suits editorial pages.' },
];

export function Typography() {
  const { config, tokens, dispatch } = useConfig();
  const shown = FONT_PAIRINGS.filter((pairing) => pairing.style === config.headingStyle);
  usePairingFonts(shown.map((pairing) => pairing.id));

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className={SECTION_HEADING}>Heading style</h2>
        <ChoiceGroup
          label="Heading style"
          value={config.headingStyle}
          onValueChange={(value) =>
            dispatch({
              type: 'set',
              patch: { headingStyle: value as DesignConfig['headingStyle'] },
            })
          }
          className="grid max-w-md grid-cols-2 gap-3"
        >
          <ChoiceCard value="sans" title="Sans-serif" />
          <ChoiceCard value="serif" title="Serif" />
        </ChoiceGroup>
      </section>

      <section>
        <h2 className={SECTION_HEADING}>Font pairing</h2>
        <ChoiceGroup
          label="Font pairing"
          value={config.fontPairingId}
          onValueChange={(fontPairingId) => dispatch({ type: 'set', patch: { fontPairingId } })}
          className="grid gap-4 @xl:grid-cols-2"
        >
          {shown.map((pairing) => (
            <ChoiceCard
              key={pairing.id}
              value={pairing.id}
              title={pairing.name}
              illustration={<Specimen pairing={pairing} />}
            />
          ))}
        </ChoiceGroup>
      </section>

      <section>
        <h2 className={SECTION_HEADING}>Size contrast</h2>
        <ChoiceGroup
          label="Size contrast"
          value={config.typeScale}
          onValueChange={(value) =>
            dispatch({ type: 'set', patch: { typeScale: value as DesignConfig['typeScale'] } })
          }
          className="grid gap-3 @2xl:grid-cols-3"
        >
          {SCALES.map((scale) => (
            <ChoiceCard
              key={scale.id}
              value={scale.id}
              title={scale.title}
              description={scale.description}
              illustration={
                <span className="block truncate font-mono text-label text-muted">
                  {typeSizes(tokens.type.baseSize, TYPE_RATIO[scale.id]).join(' / ')}
                </span>
              }
            />
          ))}
        </ChoiceGroup>
      </section>
    </div>
  );
}
