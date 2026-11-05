import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-surface text-ink hover:border-line-strong',
  ghost: 'text-muted hover:text-ink',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** Render the child element (usually a Link) with button styling. */
  asChild?: boolean;
}

export function Button({ variant = 'primary', asChild, className = '', ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-button px-4 text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
