import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-28 w-full rounded-[4px] border border-[var(--outline-variant)] bg-[var(--surface-lowest)] px-3 py-2.5 text-sm text-[var(--on-surface)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--primary)] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          "[font-family:var(--font-plus-jakarta),system-ui,sans-serif]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
