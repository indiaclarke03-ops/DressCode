import type { InputHTMLAttributes } from 'react';

export function TextInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-11 w-full rounded-button border border-line-strong bg-surface px-3 text-base text-ink placeholder:text-muted ${className}`}
      {...props}
    />
  );
}
