import { useConfig } from '@/app/ConfigContext';
import { ChoiceCard, ChoiceGroup } from '@/components/ui/ChoiceCard';
import { TextInput } from '@/components/ui/TextInput';
import type { RestyleScope } from '@/tokens/types';

const SCOPES: { id: RestyleScope; title: string; description: string }[] = [
  { id: 'full', title: 'Full redesign', description: 'New tokens everywhere, and layout polish is allowed.' },
  { id: 'retheme', title: 'Re-theme only', description: 'Colours, fonts, corners and shadows. No layout changes.' },
  { id: 'gradual', title: 'Gradual', description: 'Change one page or component first, then roll out.' },
];

export function ChangeSize() {
  const { config, dispatch } = useConfig();
  const scope = config.restyle?.scope ?? 'retheme';

  return (
    <>
      <ChoiceGroup
        label="How big a change?"
        value={scope}
        onValueChange={(value) =>
          dispatch({ type: 'setRestyle', patch: { scope: value as RestyleScope } })
        }
        className="grid gap-3 md:grid-cols-3"
      >
        {SCOPES.map((item) => (
          <ChoiceCard key={item.id} value={item.id} title={item.title} description={item.description} />
        ))}
      </ChoiceGroup>

      {scope === 'gradual' ? (
        <label className="mt-6 block max-w-reading text-sm font-medium text-ink">
          Which page or component first?
          <TextInput
            className="mt-1.5 font-normal"
            maxLength={120}
            placeholder="The Settings page"
            value={config.restyle?.gradualTarget ?? ''}
            onChange={(event) =>
              dispatch({ type: 'setRestyle', patch: { gradualTarget: event.target.value } })
            }
          />
        </label>
      ) : null}
    </>
  );
}
