"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { EditIconButton, DeleteIconButton } from "@/components/admin/crud-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { PermisoFormDialog } from "@/components/admin/permiso-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PRODUCTS } from "@/lib/admin-constants";
import { cn, formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo } from "@/types/admin";

export function PermisosCrudPanel({
  permissionsByProduct,
}: {
  permissionsByProduct: Record<ProductoNovo, PermisoAdmin[]>;
}) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductoNovo>("cards");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function switchProduct(product: ProductoNovo) {
    setSelectedProduct(product);
    setConfirmingId(null);
    setDeleteError(null);
  }

  async function handleDelete(permission: PermisoAdmin) {
    setDeletingId(permission.id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/permisos/${permission.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setDeleteError(payload.message || "No fue posible eliminar el permiso");
        return;
      }

      setConfirmingId(null);
      startTransition(() => router.refresh());
    } catch {
      setDeleteError("No fue posible contactar al servidor");
    } finally {
      setDeletingId(null);
    }
  }

  const permissions = permissionsByProduct[selectedProduct];

  return (
    <Card>
      {/* Tab bar */}
      <div className="flex border-b border-[var(--outline-variant)] px-2">
        {PRODUCTS.map((product) => {
          const count = permissionsByProduct[product].length;
          const active = selectedProduct === product;

          return (
            <button
              key={product}
              onClick={() => switchProduct(product)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors -mb-px",
                active
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--on-surface)]",
              )}
            >
              {formatLabel(product)}
              <span
                className={cn(
                  "font-data rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active
                    ? "bg-[var(--color-accent-soft)] text-[var(--primary)]"
                    : "bg-[var(--surface-low)] text-[var(--color-muted-foreground)]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table for selected product */}
      <CardContent className="p-0">
        {!permissions.length ? (
          <EmptyState
            title="Sin permisos"
            description={`No hay permisos registrados para ${formatLabel(selectedProduct)}.`}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clave</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <code className="font-data rounded-[4px] bg-[var(--surface-low)] px-2 py-1 text-xs text-[var(--on-surface)]">
                      {permission.clave}
                    </code>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{permission.nombre}</p>
                    {permission.descripcion ? (
                      <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{permission.descripcion}</p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <PermisoFormDialog
                        mode="edit"
                        permiso={permission}
                        trigger={<EditIconButton label={`Editar permiso ${permission.nombre}`} />}
                      />
                      {confirmingId === permission.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--color-muted-foreground)]">¿Eliminar permiso?</span>
                          <Button
                            disabled={deletingId === permission.id}
                            onClick={() => handleDelete(permission)}
                            size="sm"
                            variant="destructive"
                          >
                            {deletingId === permission.id ? "Eliminando..." : "Eliminar"}
                          </Button>
                          <Button
                            disabled={deletingId === permission.id}
                            onClick={() => setConfirmingId(null)}
                            size="sm"
                            variant="secondary"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <DeleteIconButton
                          label={`Eliminar permiso ${permission.nombre}`}
                          onClick={() => {
                            setDeleteError(null);
                            setConfirmingId(permission.id);
                          }}
                        />
                      )}
                    </div>
                    {deleteError && confirmingId === permission.id ? (
                      <p className="mt-2 text-right text-sm text-[var(--error)]">{deleteError}</p>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
