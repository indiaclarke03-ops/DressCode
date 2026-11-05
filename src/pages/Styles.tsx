import { Download, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { downloadText } from '@/lib/download';
import { exportStyles, type SavedStyle } from '@/lib/styleLibrary';
import { useStyleLibrary } from '@/lib/useStyleLibrary';
import { StyleCard } from './StyleCard';

const EXPORT_NAME = 'dress-code-styles.json';

export default function Styles() {
  const { styles, error, remove, importFile } = useStyleLibrary();
  const [deleting, setDeleting] = useState<SavedStyle | null>(null);
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const count = importFile(await file.text());
    setNotice(
      count === null
        ? "That file doesn't look like a Dress Code export."
        : `Added ${count} ${count === 1 ? 'style' : 'styles'}.`,
    );
  };

  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8 md:py-16">
      <h1 className="m-0 font-display text-title font-normal text-ink">My styles</h1>
      <p className="mt-3 mb-0 max-w-reading text-muted">
        Keep a style for your brand or company, then copy it before anything you make: a website,
        a slide deck, a graphic, a report.
      </p>
      <p className="mt-2 mb-0 max-w-reading text-sm text-muted">
        Styles are saved in this browser only and never uploaded, so they won't follow you to
        another device. To move or share one, export it as a file.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          <Upload aria-hidden size={16} />
          Import
        </Button>
        {styles.length ? (
          <Button variant="secondary" onClick={() => downloadText(EXPORT_NAME, exportStyles(styles))}>
            <Download aria-hidden size={16} />
            Export all
          </Button>
        ) : null}
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          aria-label="Import a styles file"
          className="sr-only"
          tabIndex={-1}
          onChange={onImport}
        />
      </div>

      <p role="status" className="mt-3 mb-0 text-sm text-ink empty:hidden">
        {error || notice}
      </p>

      {styles.length ? (
        <ul className="mt-8 flex list-none flex-col gap-4 p-0">
          {styles.map((style) => (
            <li key={style.id}>
              <StyleCard style={style} onDelete={() => setDeleting(style)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-card border border-line bg-surface p-8">
          <h2 className="m-0 font-display text-heading font-normal text-ink">No saved styles yet</h2>
          <p className="mt-2 mb-5 max-w-reading text-muted">
            Make a style, then press "Save this style" on the Review step.
          </p>
          <Button asChild>
            <Link to="/fresh">Start fresh</Link>
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Delete "${deleting?.name ?? ''}"?`}
        description="This can't be undone. Export it first if you might want it again."
      >
        <Button variant="secondary" onClick={() => setDeleting(null)}>
          Keep it
        </Button>
        <Button
          onClick={() => {
            if (deleting) remove(deleting.id);
            setDeleting(null);
          }}
        >
          Delete
        </Button>
      </ConfirmDialog>
    </div>
  );
}
