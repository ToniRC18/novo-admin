"use client";

import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
    >
      {children}
    </label>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p
      className="text-sm text-[var(--error)]"
      style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
    >
      {message}
    </p>
  );
}

export function CheckboxCard({
  checked,
  disabled,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  description?: string | null;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[12px] bg-[var(--surface)] px-3 py-3 transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "",
        checked ? "bg-[var(--color-accent-soft)]" : "",
      )}
    >
      <input
        checked={checked}
        className="mt-0.5 h-4 w-4 rounded-[4px] border-[var(--outline-variant)] accent-[var(--primary)]"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="block space-y-0.5">
        <span
          className="block text-sm font-semibold text-[var(--on-surface)]"
          style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
        >
          {label}
        </span>
        {description ? (
          <span
            className="block text-xs text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
