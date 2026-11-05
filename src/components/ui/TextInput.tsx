import { forwardRef, type InputHTMLAttributes } from 'react';

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`min-h-11 w-full rounded-button border border-line-strong bg-surface px-3 text-base text-ink placeholder:text-muted ${className}`}
        {...props}
      />
    );
  },
);
