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
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1
            className="text-4xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none"
            style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
          >
            {title}
          </h1>
          <p
            className="max-w-2xl text-sm text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            {description}
          </p>
        </div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
