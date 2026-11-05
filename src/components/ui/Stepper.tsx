import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StepperStep {
  id: string;
  label: string;
  href: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentId: string;
}

/** Completed steps are links; steps ahead stay inert until reached. */
export function Stepper({ steps, currentId }: StepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentId);
  const current = steps[currentIndex];

  return (
    <nav aria-label="Progress">
      <p className="mb-2 flex justify-between text-sm lg:hidden">
        <span className="font-medium text-ink">{current?.label}</span>
        <span className="font-mono text-label leading-5 text-muted">
          {currentIndex + 1} / {steps.length}
        </span>
      </p>
      <ol className="flex gap-1 lg:gap-0">
        {steps.map((step, index) => (
          <li key={step.id} className="min-w-0 flex-1">
            <StepItem step={step} number={index + 1} index={index} currentIndex={currentIndex} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface StepItemProps {
  step: StepperStep;
  number: number;
  index: number;
  currentIndex: number;
}

function StepItem({ step, number, index, currentIndex }: StepItemProps) {
  const isDone = index < currentIndex;
  const isCurrent = index === currentIndex;

  const body = (
    <>
      <span
        className={`block h-0.5 transition-colors duration-200 ${isDone || isCurrent ? 'bg-accent' : 'bg-line'}`}
      />
      <span className="sr-only lg:not-sr-only lg:mt-2.5 lg:flex lg:items-center lg:gap-1.5 lg:pr-3 lg:text-sm">
        {isDone ? (
          <Check aria-hidden size={14} className="shrink-0 text-accent-ink" />
        ) : (
          <span aria-hidden className="font-mono text-label text-muted">
            {number}
          </span>
        )}
        <span className={`truncate ${isCurrent ? 'font-medium text-ink' : 'text-muted'}`}>
          {step.label}
        </span>
      </span>
    </>
  );

  if (isDone) {
    return (
      <Link
        to={step.href}
        className="block py-3 hover:[&_.truncate]:text-ink lg:py-2"
        aria-label={`${step.label}, completed`}
      >
        {body}
      </Link>
    );
  }
  return (
    <span className="block py-3 lg:py-2" aria-current={isCurrent ? 'step' : undefined}>
      {body}
    </span>
  );
}
