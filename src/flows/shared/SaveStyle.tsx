import { Bookmark, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { findByName } from '@/lib/styleLibrary';
import { useStyleLibrary } from '@/lib/useStyleLibrary';
import type { DesignConfig } from '@/tokens/types';

interface SaveStyleProps {
  config: DesignConfig;
  /** Sends focus to the name field when a name is missing. */
  onNameMissing: () => void;
}

export function SaveStyle({ config, onNameMissing }: SaveStyleProps) {
  const { styles, error, save } = useStyleLibrary();
  const [saved, setSaved] = useState(false);
  const [askedAbout, setAskedAbout] = useState('');
  const name = config.name.trim();
  const existing = askedAbout ? findByName(styles, askedAbout) : undefined;

  const finish = (ok: boolean) => {
    setAskedAbout('');
    setSaved(ok);
  };

  const onSave = () => {
    if (!name) {
      onNameMissing();
      return;
    }
    if (findByName(styles, name)) setAskedAbout(name);
    else finish(save(name, config));
  };

  return (
    <>
      <Button onClick={onSave}>
        {saved ? <Check aria-hidden size={16} /> : <Bookmark aria-hidden size={16} />}
        {saved ? 'Saved' : 'Save this style'}
      </Button>
      <p aria-live="polite" className="m-0 basis-full text-sm text-muted empty:hidden">
        {saved ? (
          <>
            Saved in this browser. Find it in{' '}
            <Link to="/styles" className="text-accent-ink underline underline-offset-4">
              My styles
            </Link>
            .
          </>
        ) : (
          error
        )}
      </p>

      <ConfirmDialog
        open={existing !== undefined}
        onOpenChange={(open) => {
          if (!open) setAskedAbout('');
        }}
        title={`You already have "${existing?.name ?? ''}"`}
        description="Update the saved style with these choices, or keep both?"
      >
        <Button variant="secondary" onClick={() => finish(save(name, config))}>
          Keep both
        </Button>
        <Button onClick={() => finish(save(name, config, existing))}>Update it</Button>
      </ConfirmDialog>
    </>
  );
}
