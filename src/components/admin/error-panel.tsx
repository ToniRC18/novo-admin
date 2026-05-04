import { AlertCircle } from "lucide-react";

export function ErrorPanel({
  title = "No fue posible cargar esta sección",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="rounded-[4px] border border-[var(--error-border)] bg-[var(--error-surface)] px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--error-text)]" />
        <div className="space-y-0.5">
          <p className="font-data text-sm font-bold text-[var(--error-heading)]">
            {title}
          </p>
          <p className="text-sm text-[var(--error-text)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
