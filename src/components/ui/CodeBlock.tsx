import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CodeBlockProps {
  filename: string;
  code: string;
}

const COPIED_MS = 1800;

export function CodeBlock({ filename, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className="m-0 overflow-hidden rounded-card border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line py-1 pr-1 pl-4">
        <span className="truncate font-mono text-label text-muted">{filename}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-button px-2.5 text-sm text-muted transition-colors duration-150 hover:text-ink"
        >
          {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={`Contents of ${filename}`}
        className="m-0 overflow-x-auto p-4 font-mono text-sm/6 text-ink"
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
