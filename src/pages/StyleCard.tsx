import { Copy, Download, Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { designMd } from '@/generators/designMd';
import { styleSlug } from '@/generators/shared';
import { MEDIUMS, stylePrompt, type MediumId } from '@/generators/stylePrompt';
import { downloadText } from '@/lib/download';
import { exportStyles, type SavedStyle } from '@/lib/styleLibrary';
import { CONFIG_PARAM, encodeConfig, shareUrl } from '@/lib/urlState';
import { useCopy } from '@/lib/useCopy';
import { deriveTokens } from '@/tokens/deriveTokens';

const SWATCH_ROLES = ['background', 'surface', 'text', 'accent'] as const;
const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

function CopyButton({ label, text, primary }: { label: string; text: string; primary?: boolean }) {
  const { copy, copied } = useCopy();
  return (
    <Button variant={primary ? 'primary' : 'secondary'} onClick={() => copy(text)}>
      <Copy aria-hidden size={16} />
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </Button>
  );
}

export function StyleCard({ style, onDelete }: { style: SavedStyle; onDelete: () => void }) {
  const { config } = style;
  const tokens = useMemo(() => deriveTokens(config), [config]);
  const [medium, setMedium] = useState<MediumId>('website');
  const [custom, setCustom] = useState('');
  const selectId = useId();
  const editPath = `/${config.mode}/review?${CONFIG_PARAM}=${encodeConfig(config)}`;

  return (
    <article className="rounded-card border border-line bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="m-0 font-display text-heading font-normal text-ink">{style.name}</h2>
          <p className="mt-1 mb-0 text-sm text-muted">
            {tokens.fonts.pairingName}. Saved {DATE_FORMAT.format(new Date(style.savedAt))}.
          </p>
        </div>
        <div aria-hidden className="flex overflow-hidden rounded-button border border-line">
          {SWATCH_ROLES.map((role) => (
            <span key={role} className="block size-9" style={{ backgroundColor: tokens.colors[role] }} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-5">
        <label htmlFor={selectId} className="block w-full text-sm font-medium text-ink sm:w-auto">
          What are you making?
          <select
            id={selectId}
            value={medium}
            onChange={(event) => setMedium(event.target.value as MediumId)}
            className="mt-1.5 block min-h-11 w-full rounded-button border border-line-strong bg-surface px-3 text-base font-normal text-ink sm:w-64"
          >
            {MEDIUMS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {medium === 'other' ? (
          <label className="block grow text-sm font-medium text-ink sm:max-w-xs">
            Describe it
            <TextInput
              className="mt-1.5 font-normal"
              maxLength={120}
              placeholder="A trade show banner"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
            />
          </label>
        ) : null}
        <CopyButton primary label="Copy prompt" text={stylePrompt(config, tokens, medium, custom)} />
        <CopyButton label="Copy DESIGN.md" text={designMd(config, tokens)} />
      </div>
      <p className="mt-2 mb-0 text-sm text-muted">
        Paste the prompt into Claude Code, or any AI tool, before you ask it to make something.
      </p>

      <div className="mt-4 flex flex-wrap gap-1">
        <Button asChild variant="ghost">
          <Link to={editPath}>
            <Pencil aria-hidden size={15} />
            Open and edit
          </Link>
        </Button>
        <CopyLinkButton url={shareUrl(config)} />
        <Button
          variant="ghost"
          onClick={() => downloadText(`${styleSlug(config)}.json`, exportStyles([style]))}
        >
          <Download aria-hidden size={15} />
          Export
        </Button>
        <Button variant="ghost" onClick={onDelete} aria-label={`Delete ${style.name}`}>
          <Trash2 aria-hidden size={15} />
          Delete
        </Button>
      </div>
    </article>
  );
}

function CopyLinkButton({ url }: { url: string }) {
  const { copy, copied } = useCopy();
  return (
    <Button variant="ghost" onClick={() => copy(url)}>
      <LinkIcon aria-hidden size={15} />
      <span aria-live="polite">{copied ? 'Link copied' : 'Copy share link'}</span>
    </Button>
  );
}
