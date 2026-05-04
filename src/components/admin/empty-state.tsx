export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-2 py-10 text-center">
      <p className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)]">
        {title}
      </p>
      <p className="max-w-sm text-sm text-[var(--color-muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
