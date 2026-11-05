import * as Dialog from '@radix-ui/react-dialog';
import { Check, Copy, ShoppingBasket, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCopy } from '@/lib/useCopy';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { combineTweaks, type BasketItem } from '@/tweaks/build';
import type { TweakOptions } from '@/tweaks/types';

export interface BasketEntry extends BasketItem {
  uid: number;
}

interface BasketProps {
  items: BasketEntry[];
  options: TweakOptions;
  onRemove: (uid: number) => void;
  onClear: () => void;
}

const WIDE_ENOUGH = '(min-width: 80rem)';

function CopyAll({ items, options }: Pick<BasketProps, 'items' | 'options'>) {
  const { copy, copied, failed } = useCopy();
  return (
    <Button disabled={items.length === 0} onClick={() => copy(combineTweaks(items, options))}>
      {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
      <span aria-live="polite">{copied ? 'Copied' : failed ? 'Press Cmd+C' : 'Copy all'}</span>
    </Button>
  );
}

function BasketList({ items, onRemove }: Pick<BasketProps, 'items' | 'onRemove'>) {
  if (items.length === 0) {
    return <p className="m-0 text-sm text-muted">Add a few tweaks to send them as one prompt.</p>;
  }
  return (
    <ol className="m-0 flex list-none flex-col gap-1 p-0">
      {items.map((item, index) => (
        <li key={item.uid} className="flex items-center gap-2 text-sm text-ink">
          <span aria-hidden className="w-4 font-mono text-label text-muted">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">{item.tweak.title}</span>
          <button
            type="button"
            aria-label={`Remove ${item.tweak.title}`}
            onClick={() => onRemove(item.uid)}
            className="flex size-8 shrink-0 items-center justify-center rounded-button text-muted hover:text-ink"
          >
            <X aria-hidden size={15} />
          </button>
        </li>
      ))}
    </ol>
  );
}

/** A side panel on wide screens, a bar with a sheet everywhere else. */
export function Basket({ items, options, onRemove, onClear }: BasketProps) {
  const isWide = useMediaQuery(WIDE_ENOUGH);

  if (isWide) {
    return (
      <aside
        aria-label="Tweak basket"
        className="sticky top-6 self-start rounded-card border border-line bg-surface p-5"
      >
        <h2 className="mt-0 mb-3 font-display text-2xl font-normal text-ink">
          Basket ({items.length})
        </h2>
        <BasketList items={items} onRemove={onRemove} />
        <div className="mt-4 flex items-center gap-2">
          <CopyAll items={items} options={options} />
          {items.length ? (
            <Button variant="ghost" onClick={onClear}>
              Clear
            </Button>
          ) : null}
        </div>
      </aside>
    );
  }

  if (items.length === 0) return null;

  return (
    <Dialog.Root>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-2">
        <Dialog.Trigger asChild>
          <Button variant="secondary">
            <ShoppingBasket aria-hidden size={16} />
            Basket ({items.length})
          </Button>
        </Dialog.Trigger>
        <CopyAll items={items} options={options} />
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-40 flex max-h-[80dvh] flex-col gap-3 overflow-y-auto rounded-t-card bg-surface p-5"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="m-0 font-display text-2xl font-normal text-ink">
              Basket ({items.length})
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" aria-label="Close basket">
                <X aria-hidden size={18} />
              </Button>
            </Dialog.Close>
          </div>
          <BasketList items={items} onRemove={onRemove} />
          <div className="flex items-center gap-2">
            <CopyAll items={items} options={options} />
            <Button variant="ghost" onClick={onClear}>
              Clear
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
