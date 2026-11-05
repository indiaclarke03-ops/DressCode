import { Check, Download, Link as LinkIcon } from 'lucide-react';
import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Tabs } from '@/components/ui/Tabs';
import { TextInput } from '@/components/ui/TextInput';
import { generateFiles } from '@/generators';
import { styleSlug } from '@/generators/shared';
import { shareUrl } from '@/lib/urlState';
import { useCopy } from '@/lib/useCopy';
import { ColorMapEditor } from '../restyle/ColorMapEditor';
import { SaveStyle } from './SaveStyle';

const PreviewFrame = lazy(() =>
  import('@/preview/PreviewFrame').then((module) => ({ default: module.PreviewFrame })),
);

const MAX_NAME_LENGTH = 60;

const HOW_TO_USE = {
  fresh: [
    'Download everything and put DESIGN.md in the main folder of your project.',
    'Open Claude Code in that folder and paste the KICKOFF prompt.',
    'It sets up the look first, then waits. Check the screenshots, then ask for your features.',
  ],
  restyle: [
    'Download everything and put DESIGN.md and RESTYLE.md in the main folder of your project.',
    'Open Claude Code in that folder and say "Follow RESTYLE.md".',
    'It lists what it will change, then works one small step at a time. Check each one.',
  ],
};

export function Review() {
  const { config, tokens, dispatch } = useConfig();
  const files = useMemo(() => generateFiles(config, tokens), [config, tokens]);
  const share = useCopy();
  const nameField = useRef<HTMLInputElement>(null);
  const [nameMissing, setNameMissing] = useState(false);

  const downloadAll = async () => {
    const { downloadZip } = await import('@/lib/zip');
    await downloadZip(`${styleSlug(config)}-dress-code.zip`, files);
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <label className="block max-w-sm text-sm font-medium text-ink">
          Name your style
          <TextInput
            ref={nameField}
            className="mt-1.5 font-normal"
            maxLength={MAX_NAME_LENGTH}
            placeholder="Acme brand"
            value={config.name}
            aria-invalid={nameMissing}
            aria-describedby={nameMissing ? 'name-hint' : undefined}
            onChange={(event) => {
              setNameMissing(false);
              dispatch({ type: 'set', patch: { name: event.target.value } });
            }}
          />
          {nameMissing ? (
            <span id="name-hint" className="mt-1 block font-normal text-muted">
              Give your style a name so you can find it later.
            </span>
          ) : null}
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <SaveStyle
            config={config}
            onNameMissing={() => {
              setNameMissing(true);
              nameField.current?.focus();
            }}
          />
          <Button variant="secondary" onClick={downloadAll}>
            <Download aria-hidden size={16} />
            Download all (.zip)
          </Button>
          <Button variant="secondary" onClick={() => share.copy(shareUrl(config))}>
            {share.copied ? <Check aria-hidden size={16} /> : <LinkIcon aria-hidden size={16} />}
            <span aria-live="polite">{share.copied ? 'Link copied' : 'Copy share link'}</span>
          </Button>
        </div>
      </section>

      <section aria-labelledby="how-to-use">
        <h2 id="how-to-use" className="mt-0 mb-3 font-display text-heading font-normal text-ink">
          How to use this
        </h2>
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {HOW_TO_USE[config.mode].map((step, index) => (
            <li key={step} className="flex gap-3 text-ink">
              <span aria-hidden className="font-mono text-sm text-accent-ink">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="h-(--dc-preview-height)">
        <Suspense fallback={null}>
          <PreviewFrame />
        </Suspense>
      </section>

      {config.mode === 'restyle' ? <ColorMapEditor /> : null}

      <section>
        <h2 className="mt-0 mb-2 font-display text-heading font-normal text-ink">Your files</h2>
        <Tabs
          label="Export files"
          items={files.map((file) => ({
            value: file.id,
            label: file.label,
            content: (
              <CodeBlock filename={file.path} code={file.content} language={file.language} downloadable />
            ),
          }))}
        />
      </section>
    </div>
  );
}
