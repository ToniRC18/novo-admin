"use client";

import { type ReactNode, startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCTS, GLOBAL_ROLES } from "@/lib/admin-constants";
import { formatLabel } from "@/lib/utils";
import type { NegocioAdmin, UsuarioAdmin } from "@/types/admin";
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
import { FieldLabel, FormError, CheckboxCard } from "@/components/admin/form-primitives";

type UserFormDialogProps = {
  businesses: NegocioAdmin[];
  mode: "create" | "edit";
  trigger: ReactNode;
  user?: UsuarioAdmin;
};

export function UserFormDialog({
  businesses,
  mode,
  trigger,
  user,
}: UserFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [rolGlobal, setRolGlobal] = useState(user?.rolGlobal ?? "cajero");
  const [negocioId, setNegocioId] = useState(user?.negocioId ?? businesses[0]?.id ?? "");
  const [productos, setProductos] = useState<string[]>(user?.productos ?? Object.keys(user?.accesos ?? {}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === "create" ? "Nuevo usuario" : "Editar usuario";
  const description =
    mode === "create"
      ? "Crea el usuario y asigna sus productos iniciales."
      : "Edita datos generales y productos activos del usuario.";

  const businessName = useMemo(
    () => businesses.find((business) => business.id === negocioId)?.nombre ?? "Sin negocio",
    [businesses, negocioId],
  );

  function toggleProduct(producto: string, checked: boolean) {
    setProductos((current) =>
      checked ? [...new Set([...current, producto])] : current.filter((item) => item !== producto),
    );
  }

  function resetAndClose() {
    setError(null);
    setPassword("");
    setOpen(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/usuarios" : `/api/admin/usuarios/${user?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            email,
            password,
            rolGlobal,
            negocioId,
            productos,
          }),
        },
      );

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "No fue posible guardar el usuario");
        return;
      }

      resetAndClose();
      startTransition(() => {
        router.refresh();
      });
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor={`user-name-${mode}`}>Nombre</FieldLabel>
            <Input id={`user-name-${mode}`} onChange={(event) => setNombre(event.target.value)} value={nombre} />
          </div>

          <div>
            <FieldLabel htmlFor={`user-email-${mode}`}>Email</FieldLabel>
            <Input id={`user-email-${mode}`} onChange={(event) => setEmail(event.target.value)} value={email} />
          </div>

          {mode === "create" ? (
            <div>
              <FieldLabel htmlFor="user-password-create">Password</FieldLabel>
              <Input
                id="user-password-create"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </div>
          ) : null}

          <div>
            <FieldLabel>Rol global</FieldLabel>
            <Select onValueChange={setRolGlobal} value={rolGlobal}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {GLOBAL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "create" ? (
            <div>
              <FieldLabel>Negocio</FieldLabel>
              <Select onValueChange={setNegocioId} value={negocioId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un negocio" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <FieldLabel>Negocio</FieldLabel>
              <div className="rounded-[4px] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--on-surface)]">
                {businessName}
              </div>
            </div>
          )}

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

          <div className="flex justify-end gap-3 pt-2">
            <Button disabled={loading} type="button" variant="secondary" onClick={resetAndClose}>
              Cancelar
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : mode === "create" ? "Crear usuario" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
