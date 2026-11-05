import { Check, Copy, Download } from 'lucide-react';
import { useMemo } from 'react';
import type { CodeLanguage } from '@/generators';
import { downloadText } from '@/lib/download';
import { highlight, type TokenKind } from '@/lib/highlight';
import { useCopy } from '@/lib/useCopy';

interface CodeBlockProps {
  filename: string;
  code: string;
  language?: CodeLanguage;
  /** Adds a Download button. */
  downloadable?: boolean;
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: '',
  heading: 'font-medium text-code-heading',
  hex: 'text-code-hex',
  name: 'text-code-name',
  comment: 'text-code-comment',
};

const ACTION =
  'inline-flex min-h-9 items-center gap-1.5 rounded-button px-2.5 text-sm text-muted transition-colors duration-150 hover:text-ink';

export function CodeBlock({ filename, code, language = 'markdown', downloadable }: CodeBlockProps) {
  const { copy, copied, failed } = useCopy();
  const tokens = useMemo(() => highlight(code, language), [code, language]);

  return (
    <figure className="m-0 overflow-hidden rounded-card border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line py-1 pr-1 pl-4">
        <span className="truncate font-mono text-label text-muted">{filename}</span>
        <span className="flex shrink-0">
          <button type="button" onClick={() => copy(code)} className={ACTION}>
            {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
            <span aria-live="polite">{copied ? 'Copied' : failed ? 'Press Cmd+C' : 'Copy'}</span>
          </button>
          {downloadable ? (
            <button
              type="button"
              onClick={() => downloadText(filename.split('/').at(-1) ?? filename, code)}
              className={ACTION}
            >
              <Download aria-hidden size={14} />
              Download
            </button>
          ) : null}
        </span>
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={`Contents of ${filename}`}
        className="m-0 max-h-[32rem] overflow-auto p-4 font-mono text-sm/6 break-words whitespace-pre-wrap text-ink"
      >
        <code>
          {tokens.map((token, index) =>
            token.kind === 'plain' ? (
              token.text
            ) : (
              <span key={index} className={TOKEN_CLASS[token.kind]}>
                {token.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}
