import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[4px] border border-[var(--outline-variant)] bg-[var(--surface-lowest)] px-3 py-2 text-sm text-[var(--on-surface)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--primary)] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          "[font-family:var(--font-plus-jakarta),system-ui,sans-serif]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
