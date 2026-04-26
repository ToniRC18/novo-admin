"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function InlineDeleteConfirm({
  loadingLabel = "Eliminando...",
  message,
  onConfirm,
}: {
  loadingLabel?: string;
  message: string;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
        Confirmar
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <span
        className="text-xs text-[var(--color-muted-foreground)]"
        style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
      >
        {message}
      </span>
      <Button disabled={loading} onClick={handleConfirm} size="sm" variant="destructive">
        {loading ? loadingLabel : "Eliminar"}
      </Button>
      <Button disabled={loading} onClick={() => setOpen(false)} size="sm" variant="secondary">
        Cancelar
      </Button>
    </div>
  );
}
