import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { AVOID_ITEMS } from '@/tokens/defaults';

const MAX_CUSTOM_LENGTH = 120;

function AvoidRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <li>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 size-5 shrink-0 accent-accent"
        />
        <span>{label}</span>
      </label>
    </li>
  );
}

export function AvoidList() {
  const { config, dispatch } = useConfig();
  const [draft, setDraft] = useState('');
  const builtInIds: string[] = AVOID_ITEMS.map((item) => item.id);
  const custom = config.avoid.filter((item) => !builtInIds.includes(item));
  const toggle = (item: string) => dispatch({ type: 'toggleAvoid', item });

  const addCustom = (event: FormEvent) => {
    event.preventDefault();
    const item = draft.trim();
    if (item && !config.avoid.includes(item)) toggle(item);
    setDraft('');
  };

  return (
    <>
      <ul className="m-0 grid list-none gap-x-10 p-0 lg:grid-cols-2">
        {AVOID_ITEMS.map((item) => (
          <AvoidRow
            key={item.id}
            label={item.label}
            checked={config.avoid.includes(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
        {custom.map((item) => (
          <AvoidRow key={item} label={item} checked onToggle={() => toggle(item)} />
        ))}
      </ul>

      <form onSubmit={addCustom} className="mt-6 flex max-w-reading items-end gap-2">
        <label className="flex-1 text-sm text-muted">
          Add your own
          <TextInput
            className="mt-1.5"
            maxLength={MAX_CUSTOM_LENGTH}
            placeholder="Stock photos of people pointing at laptops"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </label>
        <Button type="submit" variant="secondary">
          <Plus aria-hidden size={16} />
          Add
        </Button>
      </form>
    </>
  );
}
