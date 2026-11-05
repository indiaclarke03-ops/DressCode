import * as Dialog from '@radix-ui/react-dialog';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { PreviewFrame } from './PreviewFrame';

/** Tailwind's xl breakpoint: below it there is no room beside the step. */
const WIDE_ENOUGH = '(min-width: 80rem)';

/** Beside the step on wide screens, a bottom sheet everywhere else. */
export default function PreviewPanel() {
  const isWide = useMediaQuery(WIDE_ENOUGH);

  if (isWide) {
    return (
      <aside className="sticky top-6 h-(--dc-preview-height)">
        <PreviewFrame />
      </aside>
    );
  }

  return (
    <Dialog.Root>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-2">
        <p className="m-0 text-sm text-muted">See your choices come to life</p>
        <Dialog.Trigger asChild>
          <Button variant="secondary">
            <Eye aria-hidden size={16} />
            Show preview
          </Button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-8 bottom-0 z-40 flex flex-col gap-2 rounded-t-card bg-background p-3"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="m-0 font-display text-2xl font-normal text-ink">
              Your style
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" aria-label="Close preview">
                <X aria-hidden size={18} />
              </Button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1">
            <PreviewFrame defaultDevice="mobile" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
