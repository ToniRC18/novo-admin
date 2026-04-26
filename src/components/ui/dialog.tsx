"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[var(--on-surface)]/20" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[var(--surface-lowest)] p-6",
          "shadow-[0_40px_80px_rgba(53,37,205,0.06)]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[0px] text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--surface-low)]">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className="text-xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] [font-family:var(--font-epilogue),system-ui,sans-serif]"
      {...props}
    />
  );
}

function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className="text-sm text-[var(--color-muted-foreground)] [font-family:var(--font-plus-jakarta),system-ui,sans-serif]"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
