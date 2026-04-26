"use client";

import { type ReactNode, startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCTS } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo, RolAdmin } from "@/types/admin";
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
import { CheckboxCard, FieldLabel, FormError } from "@/components/admin/form-primitives";

export function RoleFormDialog({
  initialProduct,
  mode,
  permissionsByProduct,
  role,
  trigger,
}: {
  initialProduct?: ProductoNovo;
  mode: "create" | "edit";
  permissionsByProduct: Record<ProductoNovo, PermisoAdmin[]>;
  role?: RolAdmin;
  trigger: ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [producto, setProducto] = useState<ProductoNovo>(role?.producto as ProductoNovo ?? initialProduct ?? "cards");
  const [nombre, setNombre] = useState(role?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(role?.descripcion ?? "");
  const [permisoIds, setPermisoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const currentProduct = (role?.producto as ProductoNovo | undefined) ?? producto;
    const selected =
      role?.permisos
        .map((clave) => permissionsByProduct[currentProduct].find((permiso) => permiso.clave === clave)?.id)
        .filter(Boolean) ?? [];

    setPermisoIds(selected as string[]);
  }, [open, permissionsByProduct, producto, role]);

  useEffect(() => {
    if (mode === "create") {
      setPermisoIds([]);
    }
  }, [mode, producto]);

  function closeDialog() {
    setError(null);
    setOpen(false);
  }

  function togglePermission(id: string, checked: boolean) {
    setPermisoIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(mode === "create" ? "/api/admin/roles" : `/api/admin/roles/${role?.id}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto,
          nombre,
          descripcion: descripcion || undefined,
          permisoIds,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message || "No fue posible guardar el rol");
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo rol" : "Editar rol"}</DialogTitle>
          <DialogDescription>Define nombre, descripción y permisos del rol template.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
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
              <FieldLabel htmlFor={`role-name-${mode}`}>Nombre</FieldLabel>
              <Input id={`role-name-${mode}`} onChange={(event) => setNombre(event.target.value)} value={nombre} />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={`role-description-${mode}`}>Descripción</FieldLabel>
            <Textarea
              id={`role-description-${mode}`}
              onChange={(event) => setDescripcion(event.target.value)}
              value={descripcion}
            />
          </div>

          <div className="space-y-3">
            <FieldLabel>Permisos</FieldLabel>
            <div className="grid gap-4 lg:grid-cols-3">
              {PRODUCTS.map((productKey) => (
                <div className="space-y-2 rounded-[12px] bg-[var(--surface)] p-3" key={productKey}>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--primary)]">
                    {formatLabel(productKey)}
                  </p>
                  <div className="space-y-2">
                    {permissionsByProduct[productKey].map((permiso) => (
                      <CheckboxCard
                        checked={permisoIds.includes(permiso.id)}
                        disabled={productKey !== producto}
                        description={permiso.descripcion}
                        key={permiso.id}
                        label={permiso.nombre}
                        onChange={(checked) => togglePermission(permiso.id, checked)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FormError message={error} />

          <div className="flex justify-end gap-3">
            <Button disabled={loading} onClick={closeDialog} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : mode === "create" ? "Crear rol" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
