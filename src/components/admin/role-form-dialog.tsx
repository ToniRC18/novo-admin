"use client";

import { type ReactNode, startTransition, useEffect, useMemo, useState } from "react";
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
  const [producto, setProducto] = useState<ProductoNovo>(
    (role?.producto as ProductoNovo) ?? initialProduct ?? "pos",
  );
  const [nombre, setNombre] = useState(role?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(role?.descripcion ?? "");
  const [permisoIds, setPermisoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePermissions = useMemo(
    () => permissionsByProduct[producto] ?? [],
    [permissionsByProduct, producto],
  );

  const allSelected = activePermissions.length > 0 && activePermissions.every((p) => permisoIds.includes(p.id));

  useEffect(() => {
    if (!open) return;

    const currentProduct = (role?.producto as ProductoNovo | undefined) ?? producto;
    const selected =
      role?.permisos
        .map((clave) => permissionsByProduct[currentProduct].find((p) => p.clave === clave)?.id)
        .filter(Boolean) ?? [];

    setPermisoIds(selected as string[]);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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

  function toggleAll() {
    if (allSelected) {
      setPermisoIds([]);
    } else {
      setPermisoIds(activePermissions.map((p) => p.id));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/roles" : `/api/admin/roles/${role?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producto,
            nombre,
            descripcion: descripcion || undefined,
            permisoIds,
          }),
        },
      );

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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo rol" : "Editar rol"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Define el nombre y los permisos que tendrá este rol."
              : "Modifica el nombre, descripción y permisos del rol."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Producto</FieldLabel>
              {mode === "edit" ? (
                <div className="flex h-9 items-center rounded-[4px] border border-[var(--outline-variant)] bg-[var(--surface)] px-3 text-sm font-semibold uppercase tracking-wide text-[var(--on-surface)]">
                  {formatLabel(producto)}
                </div>
              ) : (
                <Select
                  onValueChange={(value) => setProducto(value as ProductoNovo)}
                  value={producto}
                >
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
              )}
            </div>
            <div>
              <FieldLabel htmlFor={`role-name-${mode}`}>Nombre del rol</FieldLabel>
              <Input
                id={`role-name-${mode}`}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Cajero, Gerente..."
                value={nombre}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={`role-description-${mode}`}>Descripción</FieldLabel>
            <Textarea
              id={`role-description-${mode}`}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Descripción opcional del rol..."
              rows={2}
              value={descripcion ?? ""}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FieldLabel>{`Permisos — ${formatLabel(producto)}`}</FieldLabel>
              {activePermissions.length > 0 ? (
                <button
                  className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--primary)] hover:underline"
                  onClick={toggleAll}
                  type="button"
                >
                  {allSelected ? "Quitar todos" : "Seleccionar todos"}
                </button>
              ) : null}
            </div>

            {activePermissions.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">
                No hay permisos definidos para {formatLabel(producto)}.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {activePermissions.map((permiso) => (
                  <CheckboxCard
                    checked={permisoIds.includes(permiso.id)}
                    description={permiso.descripcion}
                    key={permiso.id}
                    label={permiso.nombre}
                    onChange={(checked) => togglePermission(permiso.id, checked)}
                  />
                ))}
              </div>
            )}

            <p className="text-right text-[10px] text-[var(--color-muted-foreground)]">
              {permisoIds.length} de {activePermissions.length} permisos seleccionados
            </p>
          </div>

          <FormError message={error} />

          <div className="flex justify-end gap-3 pt-1">
            <Button disabled={loading} onClick={closeDialog} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button disabled={loading || !nombre.trim()} type="submit">
              {loading ? "Guardando..." : mode === "create" ? "Crear rol" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
