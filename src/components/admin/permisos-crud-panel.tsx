"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { EditIconButton, DeleteIconButton } from "@/components/admin/crud-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { PermisoFormDialog } from "@/components/admin/permiso-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PRODUCTS } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo } from "@/types/admin";

export function PermisosCrudPanel({
  permissionsByProduct,
}: {
  permissionsByProduct: Record<ProductoNovo, PermisoAdmin[]>;
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {PRODUCTS.map((product) => {
        const permissions = permissionsByProduct[product];

        return (
          <Card key={product}>
            <CardHeader className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]">Producto</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{formatLabel(product)}</h2>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {!permissions.length ? (
                <div className="px-6 pb-6">
                  <EmptyState title="Sin permisos" description={`No hay permisos para ${formatLabel(product)}.`} />
                </div>
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
                        <TableCell className="font-data text-xs">{permission.clave}</TableCell>
                        <TableCell>
                          <p className="font-medium">{permission.nombre}</p>
                          {permission.descripcion ? (
                            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{permission.descripcion}</p>
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
      })}
    </section>
  );
}
