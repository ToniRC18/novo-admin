import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="eyebrow">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none">
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--color-muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
