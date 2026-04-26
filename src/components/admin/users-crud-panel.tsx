"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { EditIconButton, DeleteIconButton } from "@/components/admin/crud-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { NegocioAdmin, UsuarioAdmin } from "@/types/admin";

export function UsersCrudPanel({
  businesses,
  users,
}: {
  businesses: NegocioAdmin[];
  users: UsuarioAdmin[];
}) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(user: UsuarioAdmin) {
    setDeletingId(user.id);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/usuarios/${user.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setDeleteError(payload.message || "No fue posible eliminar el usuario");
        return;
      }

      setConfirmingId(null);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setDeleteError("No fue posible contactar al servidor");
    } finally {
      setDeletingId(null);
    }
  }

  if (!users.length) {
    return <EmptyState title="Sin usuarios" description="No hay usuarios registrados." />;
  }

  return (
    <Card>
      <CardContent className="p-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol global</TableHead>
              <TableHead>Negocio</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link
                    className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                    href={`/dashboard/usuarios/${user.id}`}
                  >
                    {user.nombre}
                  </Link>
                </TableCell>
                <TableCell className="text-[var(--color-muted-foreground)]">{user.email}</TableCell>
                <TableCell className="uppercase">{user.rolGlobal}</TableCell>
                <TableCell className="text-[var(--color-muted-foreground)]">
                  {user.negocio?.nombre || "Sin negocio"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <UserFormDialog
                      businesses={businesses}
                      mode="edit"
                      trigger={<EditIconButton label={`Editar a ${user.nombre}`} />}
                      user={user}
                    />

                    {confirmingId === user.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-muted-foreground)]">{`¿Eliminar a ${user.nombre}?`}</span>
                        <Button
                          disabled={deletingId === user.id}
                          onClick={() => handleDelete(user)}
                          size="sm"
                          variant="destructive"
                        >
                          {deletingId === user.id ? "Eliminando..." : "Eliminar"}
                        </Button>
                        <Button
                          disabled={deletingId === user.id}
                          onClick={() => setConfirmingId(null)}
                          size="sm"
                          variant="secondary"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <DeleteIconButton
                        label={`Eliminar a ${user.nombre}`}
                        onClick={() => {
                          setDeleteError(null);
                          setConfirmingId(user.id);
                        }}
                      />
                    )}
                  </div>
                  {deleteError && confirmingId === user.id ? (
                    <p className="mt-2 text-right text-sm text-[var(--error)]">{deleteError}</p>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
