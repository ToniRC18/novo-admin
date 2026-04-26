export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-start justify-center gap-2 px-2 py-10">
      <p
        className="text-3xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)]"
        style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
      >
        {title}
      </p>
      <p
        className="max-w-sm text-sm text-[var(--color-muted-foreground)]"
        style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
}
