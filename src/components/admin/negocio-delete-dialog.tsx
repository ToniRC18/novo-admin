"use client";

import { type ReactNode, startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import type { NegocioAdmin } from "@/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/admin/form-primitives";

export function NegocioDeleteDialog({
  business,
  trigger,
}: {
  business: NegocioAdmin;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setOpen(false);
    setStep(1);
    setConfirmation("");
    setError(null);
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/negocios/${business.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "No fue posible eliminar el negocio");
        return;
      }

      reset();
      startTransition(() => router.refresh());
    } catch {
      setError("No fue posible contactar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) reset();
        else setOpen(true);
      }}
      open={open}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar negocio</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "¿Seguro? Esta acción eliminará todos los usuarios y datos del negocio."
              : "Escribe el nombre del negocio para confirmar la eliminación."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="rounded-[12px] bg-[var(--surface)] p-4 text-sm text-[var(--color-muted-foreground)]">
              {business.nombre}
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={reset} type="button" variant="secondary">
                Cancelar
              </Button>
              <Button onClick={() => setStep(2)} type="button" variant="destructive">
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input onChange={(event) => setConfirmation(event.target.value)} value={confirmation} />
            <FormError message={error} />
            <div className="flex justify-end gap-3">
              <Button disabled={loading} onClick={reset} type="button" variant="secondary">
                Cancelar
              </Button>
              <Button
                disabled={loading || confirmation !== business.nombre}
                onClick={handleDelete}
                type="button"
                variant="destructive"
              >
                {loading ? "Eliminando..." : "Eliminar negocio"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
