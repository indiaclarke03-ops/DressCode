import * as RadioGroup from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

interface ChoiceGroupProps {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

/** A radio group of choice cards: arrow keys move between options. */
export function ChoiceGroup({ label, value, onValueChange, className, children }: ChoiceGroupProps) {
  return (
    <RadioGroup.Root
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </RadioGroup.Root>
  );
}

interface ChoiceCardProps {
  value: string;
  title: string;
  description?: string;
  illustration?: ReactNode;
}

export function ChoiceCard({ value, title, description, illustration }: ChoiceCardProps) {
  return (
    <RadioGroup.Item
      value={value}
      aria-label={description ? `${title}. ${description}` : title}
      className="group relative flex min-h-11 w-full flex-col gap-3 rounded-card border border-line bg-surface p-4 text-left transition-[border-color,box-shadow,scale] duration-150 hover:border-line-strong data-[state=checked]:scale-101 data-[state=checked]:border-accent data-[state=checked]:shadow-selected"
    >
      {illustration}
      <span className="block pr-7">
        <span className="block text-sm font-medium text-ink">{title}</span>
        {description ? <span className="mt-1 block text-sm text-muted">{description}</span> : null}
      </span>
      <RadioGroup.Indicator className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-accent text-on-accent">
        <Check aria-hidden size={13} strokeWidth={2.5} />
      </RadioGroup.Indicator>
    </RadioGroup.Item>
  );
}
