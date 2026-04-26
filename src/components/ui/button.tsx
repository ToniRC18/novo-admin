import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-[transform,box-shadow] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-[0px] bg-[var(--primary)] text-white [font-family:var(--font-space-grotesk),system-ui,sans-serif] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)]",
        secondary:
          "rounded-[0px] border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface)] [font-family:var(--font-space-grotesk),system-ui,sans-serif] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)]",
        ghost:
          "rounded-[0px] text-[var(--on-surface)] hover:bg-[var(--surface)]",
        destructive:
          "rounded-[0px] bg-[#9c2f2f] text-white [font-family:var(--font-space-grotesk),system-ui,sans-serif] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)]",
        outline:
          "rounded-[0px] border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
