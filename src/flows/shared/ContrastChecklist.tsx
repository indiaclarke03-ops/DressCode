import { Check, X } from 'lucide-react';
import { useConfig } from '@/app/ConfigContext';
import { Button } from '@/components/ui/Button';
import { checkContrast } from '@/tokens/palette';

export function ContrastChecklist() {
  const { tokens, dispatch } = useConfig();
  const checks = checkContrast(tokens.colors);
  const failing = checks.filter((check) => !check.pass).length;

  return (
    <>
      <ul className="m-0 mb-4 list-none p-0">
        {checks.map((check) => (
          <li key={check.id} className="flex items-center gap-2 py-1 text-sm text-ink">
            {check.pass ? (
              <Check aria-hidden size={15} className="shrink-0 text-accent-ink" />
            ) : (
              <X aria-hidden size={15} className="shrink-0 text-muted" />
            )}
            <span className="flex-1">{check.label}</span>
            <span className="font-mono text-label text-muted">
              {check.ratio.toFixed(2)} {check.pass ? 'pass' : 'fail'}
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        disabled={failing === 0}
        onClick={() => dispatch({ type: 'fixContrast' })}
      >
        {failing === 0 ? 'All pairs pass' : `Fix contrast (${failing})`}
      </Button>
    </>
  );
}
