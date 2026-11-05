import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** The action buttons. */
  children: ReactNode;
}

export function ConfirmDialog({ open, onOpenChange, title, description, children }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-ink/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-surface p-6">
          <Dialog.Title className="m-0 font-display text-2xl font-normal text-ink">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 mb-5 text-sm/6 text-muted">
            {description}
          </Dialog.Description>
          <div className="flex flex-wrap justify-end gap-2">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
