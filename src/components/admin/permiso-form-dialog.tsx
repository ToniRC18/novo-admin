"use client";

import { type ReactNode, startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCTS } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo } from "@/types/admin";
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
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel, FormError } from "@/components/admin/form-primitives";

export function PermisoFormDialog({
  initialProduct,
  mode,
  permiso,
  trigger,
}: {
  initialProduct?: ProductoNovo;
  mode: "create" | "edit";
  permiso?: PermisoAdmin;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [producto, setProducto] = useState<ProductoNovo>(permiso?.producto as ProductoNovo ?? initialProduct ?? "cards");
  const [clave, setClave] = useState(permiso?.clave ?? "");
  const [nombre, setNombre] = useState(permiso?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(permiso?.descripcion ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeDialog() {
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(mode === "create" ? "/api/admin/permisos" : `/api/admin/permisos/${permiso?.id}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto,
          clave,
          nombre,
          descripcion: descripcion || undefined,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message || "No fue posible guardar el permiso");
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
          <DialogTitle>{mode === "create" ? "Nuevo permiso" : "Editar permiso"}</DialogTitle>
          <DialogDescription>Configura la clave, nombre y descripción visible del permiso.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>Producto</FieldLabel>
            <Select disabled={mode === "edit"} onValueChange={(value) => setProducto(value as ProductoNovo)} value={producto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor={`permiso-clave-${mode}`}>Clave</FieldLabel>
            <Input
              disabled={mode === "edit"}
              id={`permiso-clave-${mode}`}
              onChange={(event) => setClave(event.target.value)}
              value={clave}
            />
          </div>

          <div>
            <FieldLabel htmlFor={`permiso-nombre-${mode}`}>Nombre</FieldLabel>
            <Input
              id={`permiso-nombre-${mode}`}
              onChange={(event) => setNombre(event.target.value)}
              value={nombre}
            />
          </div>

          <div>
            <FieldLabel htmlFor={`permiso-descripcion-${mode}`}>Descripción</FieldLabel>
            <Textarea
              id={`permiso-descripcion-${mode}`}
              onChange={(event) => setDescripcion(event.target.value)}
              value={descripcion}
            />
          </div>

          <FormError message={error} />

          <div className="flex justify-end gap-3">
            <Button disabled={loading} onClick={closeDialog} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : mode === "create" ? "Crear permiso" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
