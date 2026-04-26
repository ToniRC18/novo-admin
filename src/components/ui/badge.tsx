import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-1 text-xs font-bold tracking-[0.1em] uppercase [font-family:var(--font-space-grotesk),system-ui,sans-serif]",
  {
    variants: {
      variant: {
        default: "rounded-[0px] bg-[var(--primary)] text-white",
        secondary: "rounded-[0px] bg-[var(--surface-low)] text-[var(--on-surface)]",
        outline:
          "rounded-[0px] border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
