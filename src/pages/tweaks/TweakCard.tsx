import { Check, Copy, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCopy } from '@/lib/useCopy';
import { promptSegments } from '@/tweaks/build';
import type { TweakDefinition, TweakInput, TweakOptions, TweakValues } from '@/tweaks/types';

interface TweakCardProps {
  tweak: TweakDefinition;
  values: TweakValues;
  options: TweakOptions;
  onChange: (key: string, value: string | boolean) => void;
  onAdd: () => void;
}

function Control({ input, value, onChange }: { input: TweakInput; value: unknown; onChange: (value: string | boolean) => void }) {
  if (input.kind === 'select') {
    return (
      <label className="block text-sm text-muted">
        {input.label}
        <select
          aria-label={input.label}
          value={String(value ?? input.initial)}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 block min-h-11 max-w-full rounded-button border border-line-strong bg-surface px-2 text-base text-ink"
        >
          {input.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (input.kind === 'color') {
    const hex = String(value ?? input.initial);
    return (
      <label className="block text-sm text-muted">
        {input.label}
        <span className="mt-1 flex min-h-11 items-center gap-2 rounded-button border border-line-strong bg-surface px-2">
          <input
            type="color"
            value={hex}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            className="size-7 cursor-pointer border-0 bg-transparent p-0"
          />
          <span className="font-mono text-label text-ink">{hex}</span>
        </span>
      </label>
    );
  }
  if (input.kind === 'toggle') {
    return (
      <label className="flex min-h-11 items-center gap-2 self-end text-sm text-ink">
        <input
          type="checkbox"
          checked={value === undefined ? input.initial : value === true}
          onChange={(event) => onChange(event.target.checked)}
          className="size-5 accent-accent"
        />
        {input.label}
      </label>
    );
  }
  return null;
}

function InlineField({ input, value, onChange }: { input: Extract<TweakInput, { kind: 'text' }>; value: string; onChange: (value: string) => void }) {
  return (
    <input
      aria-label={input.label}
      placeholder={input.placeholder}
      value={value}
      size={Math.max(value.length, input.placeholder.length)}
      onChange={(event) => onChange(event.target.value)}
      className="max-w-full rounded-sm border-b border-accent bg-transparent font-mono text-sm text-ink placeholder:text-accent-ink"
    />
  );
}

export function TweakCard({ tweak, values, options, onChange, onAdd }: TweakCardProps) {
  const { copy, copied, failed } = useCopy();
  const [added, setAdded] = useState(false);
  const controls = tweak.inputs.filter((input) => input.kind !== 'text');
  const segments = promptSegments(tweak, values, options);
  const hasBlanks = tweak.inputs.some(
    (input) => input.kind === 'text' && !String(values[input.key] ?? '').trim(),
  );

  return (
    <article className="rounded-card border border-line bg-surface p-5">
      <h2 className="m-0 text-base font-medium text-ink">{tweak.title}</h2>

      {controls.length ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {controls.map((input) => (
            <Control
              key={input.key}
              input={input}
              value={values[input.key]}
              onChange={(value) => onChange(input.key, value)}
            />
          ))}
        </div>
      ) : null}

      <div
        data-testid={`prompt-${tweak.id}`}
        className="mt-4 rounded-button bg-background p-4 font-mono text-sm/6 break-words whitespace-pre-wrap text-ink"
      >
        {segments.map((segment, index) => {
          if (segment.kind === 'text') return <span key={index}>{segment.text}</span>;
          const input = tweak.inputs.find((item) => item.key === segment.key);
          if (input?.kind !== 'text') return null;
          return (
            <InlineField
              key={`${segment.key}-${index}`}
              input={input}
              value={String(values[input.key] ?? '')}
              onChange={(value) => onChange(input.key, value)}
            />
          );
        })}
      </div>

      {hasBlanks ? (
        <p className="mt-2 mb-0 text-sm text-muted">
          Fill in the underlined parts, or leave them for your agent to work out.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => copy(tweak.template(values, options))}>
          {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
          <span aria-live="polite">{copied ? 'Copied' : failed ? 'Press Cmd+C' : 'Copy'}</span>
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onAdd();
            setAdded(true);
          }}
        >
          <Plus aria-hidden size={16} />
          {added ? 'Add another' : 'Add to basket'}
        </Button>
      </div>
    </article>
  );
}
