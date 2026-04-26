"use client";

import { type ReactNode, startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { BUSINESS_PLANS, PRODUCTS } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckboxCard, FieldLabel, FormError } from "@/components/admin/form-primitives";

export function NegocioFormDialog({
  business,
  trigger,
}: {
  business: NegocioAdmin;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(business.nombre);
  const [plan, setPlan] = useState(business.plan);
  const [productos, setProductos] = useState<string[]>(business.productosActivos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeDialog() {
    setError(null);
    setOpen(false);
  }

  function toggleProduct(producto: string, checked: boolean) {
    setProductos((current) =>
      checked ? [...new Set([...current, producto])] : current.filter((item) => item !== producto),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/negocios/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          plan,
          productos,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message || "No fue posible guardar el negocio");
        return;
      }

      closeDialog();
      startTransition(() => router.refresh());
    } catch {
      setError("No fue posible contactar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar negocio</DialogTitle>
          <DialogDescription>Ajusta nombre, plan y productos activos del negocio.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor={`business-name-${business.id}`}>Nombre</FieldLabel>
            <Input
              id={`business-name-${business.id}`}
              onChange={(event) => setNombre(event.target.value)}
              value={nombre}
            />
          </div>

          <div>
            <FieldLabel>Plan</FieldLabel>
            <Select onValueChange={setPlan} value={plan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un plan" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_PLANS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel>Productos</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {PRODUCTS.map((producto) => (
                <CheckboxCard
                  checked={productos.includes(producto)}
                  key={producto}
                  label={formatLabel(producto)}
                  onChange={(checked) => toggleProduct(producto, checked)}
                />
              ))}
            </div>
          </div>

          <FormError message={error} />

          <div className="flex justify-end gap-3">
            <Button disabled={loading} onClick={closeDialog} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
