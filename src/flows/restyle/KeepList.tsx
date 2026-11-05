import { Lock } from 'lucide-react';
import { useConfig } from '@/app/ConfigContext';
import { TextInput } from '@/components/ui/TextInput';
import { normalizeHex } from '@/tokens/color';
import { KEEP_ITEMS, LOCKED_KEEP_ITEM } from '@/tokens/defaults';

export function KeepList() {
  const { config, dispatch } = useConfig();
  const keep = config.restyle?.keep ?? [LOCKED_KEEP_ITEM];
  const colours = config.restyle?.extracted?.colors ?? [];
  const keepColor = config.restyle?.keepColor;
  const keepsBrand = keep.includes('brand-colour');

  const toggle = (id: string) =>
    dispatch({
      type: 'setRestyle',
      patch: { keep: keep.includes(id) ? keep.filter((item) => item !== id) : [...keep, id] },
    });

  return (
    <div className="flex max-w-2xl flex-col gap-1">
      {KEEP_ITEMS.map((item) => {
        const locked = item.id === LOCKED_KEEP_ITEM;
        return (
          <label key={item.id} className="flex min-h-11 items-start gap-3 py-2 text-ink">
            <input
              type="checkbox"
              checked={keep.includes(item.id)}
              disabled={locked}
              onChange={() => toggle(item.id)}
              className="mt-0.5 size-5 shrink-0 accent-accent"
            />
            <span>
              {item.label}
              {locked ? (
                <span className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                  <Lock aria-hidden size={13} />
                  We never change what your app does
                </span>
              ) : null}
            </span>
          </label>
        );
      })}

      {keepsBrand ? (
        <div className="mt-3 rounded-card border border-line bg-surface p-4">
          <p className="mt-0 mb-2 text-sm font-medium text-ink">Which colour is your brand colour?</p>
          {colours.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {colours.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  aria-label={`Brand colour ${colour}`}
                  aria-pressed={keepColor === colour}
                  title={colour}
                  onClick={() => dispatch({ type: 'setRestyle', patch: { keepColor: colour } })}
                  className="size-11 rounded-button border border-line aria-pressed:ring-2 aria-pressed:ring-ink aria-pressed:ring-offset-2 aria-pressed:ring-offset-surface"
                  style={{ backgroundColor: colour }}
                />
              ))}
            </div>
          ) : null}
          <label className="block max-w-56 text-sm text-muted">
            Colour code (hex)
            <TextInput
              className="mt-1.5 font-mono"
              maxLength={7}
              spellCheck={false}
              defaultValue={keepColor ?? ''}
              key={keepColor ?? 'none'}
              onChange={(event) => {
                const hex = normalizeHex(event.target.value);
                if (hex) dispatch({ type: 'setRestyle', patch: { keepColor: hex } });
              }}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
