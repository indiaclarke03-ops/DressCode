import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { initialValues } from '@/tweaks/build';
import { ALL_TWEAKS, searchTweaks, TWEAK_CATEGORIES } from '@/tweaks';
import type { TweakDefinition, TweakValues } from '@/tweaks/types';
import { Basket, type BasketEntry } from './tweaks/Basket';
import { TweakCard } from './tweaks/TweakCard';

function GlobalToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 accent-accent"
      />
      {label}
    </label>
  );
}

export default function Tweaks() {
  const [category, setCategory] = useState(TWEAK_CATEGORIES[0] ?? '');
  const [query, setQuery] = useState('');
  const [hasDesignMd, setHasDesignMd] = useState(false);
  const [verify, setVerify] = useState(true);
  const [edits, setEdits] = useState<Record<string, TweakValues>>({});
  const [basket, setBasket] = useState<BasketEntry[]>([]);
  const nextUid = useRef(1);
  const options = { hasDesignMd, verify };

  const searching = query.trim().length > 0;
  const shown = searching
    ? searchTweaks(query)
    : ALL_TWEAKS.filter((tweak) => tweak.category === category);

  const valuesFor = (tweak: TweakDefinition): TweakValues => ({
    ...initialValues(tweak),
    ...edits[tweak.id],
  });

  const edit = (id: string, key: string, value: string | boolean) =>
    setEdits((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));

  const addToBasket = (tweak: TweakDefinition) => {
    const uid = nextUid.current;
    nextUid.current += 1;
    setBasket((items) => [...items, { uid, tweak, values: valuesFor(tweak) }]);
  };

  return (
    <div className="mx-auto max-w-flow px-4 py-10 pb-24 md:px-8 md:py-14 xl:pb-14">
      <h1 className="m-0 font-display text-title font-normal text-ink">Quick tweaks</h1>
      <p className="mt-3 mb-0 max-w-reading text-muted">
        One change, one short and precise prompt. Pick a tweak, adjust it, and paste it into Claude
        Code or any AI coding agent.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Search tweaks</span>
          <Search aria-hidden size={16} className="absolute top-3.5 left-3 text-muted" />
          <TextInput
            type="search"
            className="pl-9"
            placeholder={`Search ${ALL_TWEAKS.length} tweaks`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <GlobalToggle label="I have a DESIGN.md" checked={hasDesignMd} onChange={setHasDesignMd} />
        <GlobalToggle label="Ask Claude to screenshot and check" checked={verify} onChange={setVerify} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_18rem]">
        <nav aria-label="Tweak categories" className="min-w-0">
          <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 lg:sticky lg:top-6 lg:flex-col">
            {TWEAK_CATEGORIES.map((name) => (
              <li key={name} className="shrink-0">
                <button
                  type="button"
                  aria-current={!searching && name === category ? 'true' : undefined}
                  onClick={() => {
                    setQuery('');
                    setCategory(name);
                  }}
                  className="min-h-11 w-full rounded-button px-3 text-left text-sm whitespace-nowrap text-muted transition-colors duration-150 hover:text-ink aria-[current=true]:bg-surface aria-[current=true]:font-medium aria-[current=true]:text-ink"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label={searching ? 'Search results' : category} className="flex min-w-0 flex-col gap-4">
          {shown.length ? (
            shown.map((tweak) => (
              <TweakCard
                key={tweak.id}
                tweak={tweak}
                values={valuesFor(tweak)}
                options={options}
                onChange={(key, value) => edit(tweak.id, key, value)}
                onAdd={() => addToBasket(tweak)}
              />
            ))
          ) : (
            <p className="m-0 text-muted">Nothing matches that. Try one word, such as "map" or "colour".</p>
          )}
        </section>

        <Basket
          items={basket}
          options={options}
          onRemove={(uid) => setBasket((items) => items.filter((item) => item.uid !== uid))}
          onClear={() => setBasket([])}
        />
      </div>
    </div>
  );
}
