"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { EditIconButton, DeleteIconButton } from "@/components/admin/crud-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { RoleFormDialog } from "@/components/admin/role-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PRODUCTS } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo, RolAdmin } from "@/types/admin";

export function RolesCrudPanel({
  permissionsByProduct,
  rolesByProduct,
}: {
  permissionsByProduct: Record<ProductoNovo, PermisoAdmin[]>;
  rolesByProduct: Record<ProductoNovo, RolAdmin[]>;
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(role: RolAdmin) {
    setDeletingId(role.id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setDeleteError(payload.message || "No fue posible eliminar el rol");
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
        const roles = rolesByProduct[product];

        return (
          <Card key={product}>
            <CardHeader className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]">Producto</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{formatLabel(product)}</h2>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {!roles.length ? (
                <div className="px-6 pb-6">
                  <EmptyState title="Sin roles" description={`No hay roles para ${formatLabel(product)}.`} />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Link className="font-medium text-[var(--primary)] hover:underline" href={`/dashboard/roles/${role.id}`}>
                            {role.nombre}
                          </Link>
                          {role.descripcion ? (
                            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{role.descripcion}</p>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-[var(--color-muted-foreground)]">{role.permisos.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <RoleFormDialog
                              mode="edit"
                              permissionsByProduct={permissionsByProduct}
                              role={role}
                              trigger={<EditIconButton label={`Editar rol ${role.nombre}`} />}
                            />
                            {confirmingId === role.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--color-muted-foreground)]">¿Eliminar rol?</span>
                                <Button
                                  disabled={deletingId === role.id}
                                  onClick={() => handleDelete(role)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  {deletingId === role.id ? "Eliminando..." : "Eliminar"}
                                </Button>
                                <Button
                                  disabled={deletingId === role.id}
                                  onClick={() => setConfirmingId(null)}
                                  size="sm"
                                  variant="secondary"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <DeleteIconButton
                                label={`Eliminar rol ${role.nombre}`}
                                onClick={() => {
                                  setDeleteError(null);
                                  setConfirmingId(role.id);
                                }}
                              />
                            )}
                          </div>
                          {deleteError && confirmingId === role.id ? (
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
