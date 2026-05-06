"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { EditIconButton } from "@/components/admin/crud-actions";
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
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggleActivo(user: UsuarioAdmin) {
    setLoadingId(user.id);
    setActionError(null);

    try {
      const response = await fetch(`/api/admin/usuarios/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !user.activo }),
      });
      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setActionError(payload.message || "No fue posible cambiar el estado del usuario");
        return;
      }

      setConfirmingId(null);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setActionError("No fue posible contactar al servidor");
    } finally {
      setLoadingId(null);
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
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isActive = user.activo !== false;
              return (
                <TableRow key={user.id} className={!isActive ? "opacity-60" : ""}>
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
                    <span
                      className={`inline-flex items-center rounded-[0px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
                        isActive
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : "bg-[#f4f4f5] text-[#71717a]"
                      }`}
                    >
                      {isActive ? "Activo" : "Inactivo"}
                    </span>
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
                          <span className="text-xs text-[var(--color-muted-foreground)]">
                            {isActive ? `¿Desactivar a ${user.nombre}?` : `¿Activar a ${user.nombre}?`}
                          </span>
                          <Button
                            disabled={loadingId === user.id}
                            onClick={() => handleToggleActivo(user)}
                            size="sm"
                            variant={isActive ? "destructive" : "default"}
                          >
                            {loadingId === user.id
                              ? isActive ? "Desactivando..." : "Activando..."
                              : isActive ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            disabled={loadingId === user.id}
                            onClick={() => setConfirmingId(null)}
                            size="sm"
                            variant="secondary"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setActionError(null);
                            setConfirmingId(user.id);
                          }}
                          size="sm"
                          variant={isActive ? "outline" : "ghost"}
                          className="text-xs"
                        >
                          {isActive ? "Desactivar" : "Activar"}
                        </Button>
                      )}
                    </div>
                    {actionError && confirmingId === user.id ? (
                      <p className="mt-2 text-right text-sm text-[var(--error)]">{actionError}</p>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
