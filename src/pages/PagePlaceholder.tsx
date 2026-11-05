/** Marks a shell that a later build phase fills in. */
export function PagePlaceholder({ phase }: { phase: number }) {
  return (
    <div className="mt-8 flex min-h-64 items-center justify-center rounded-card border border-dashed border-line-strong p-6 text-center text-sm text-muted">
      Coming in Phase {phase}
    </div>
  );
}
