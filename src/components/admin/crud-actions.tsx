"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EditIconButton({
  onClick,
  label,
}: {
  onClick?: () => void;
  label: string;
}) {
  return (
    <Button aria-label={label} onClick={onClick} size="icon" type="button" variant="ghost">
      <Pencil className="h-4 w-4" />
    </Button>
  );
}

export function DeleteIconButton({
  onClick,
  label,
}: {
  onClick?: () => void;
  label: string;
}) {
  return (
    <Button aria-label={label} onClick={onClick} size="icon" type="button" variant="ghost">
      <Trash2 className="h-4 w-4 text-[var(--error)]" />
    </Button>
  );
}
