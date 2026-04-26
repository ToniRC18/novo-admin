"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatLabel } from "@/lib/utils";
import type { RolAdmin } from "@/types/admin";

export function RoleAssignmentCard({
  negocioId,
  producto,
  currentRoleId,
  currentRoleName,
  roles,
  userId,
}: {
  negocioId: string;
  producto: string;
  currentRoleId?: string;
  currentRoleName?: string;
  roles: RolAdmin[];
  userId: string;
}) {
  const router = useRouter();
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/usuarios/${userId}/rol`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto,
          rolId: selectedRoleId,
          negocioId,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "No fue posible asignar el rol");
        return;
      }

      setSuccess("Rol actualizado correctamente");
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
    <Card>
      <CardHeader className="pb-4">
        {/* Eyebrow */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        >
          Producto
        </p>
        {/* Title */}
        <h3
          className="text-xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none"
          style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
        >
          {formatLabel(producto)}
        </h3>
        {/* Current role chip */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-xs text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            Acceso actual:
          </span>
          {currentRoleName ? (
            <span
              className="inline-flex items-center rounded-[0px] bg-[var(--primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              {currentRoleName}
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-[0px] border border-[var(--outline-variant)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-muted-foreground)]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Sin acceso
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
          <SelectTrigger id={`role-select-${producto}`}>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error ? (
          <p
            className="text-sm text-[#9c2f2f]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            {error}
          </p>
        ) : null}
        {success ? (
          <p
            className="text-sm text-[#2d6a4f]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            {success}
          </p>
        ) : null}

        <button
          onClick={handleAssign}
          disabled={loading || !selectedRoleId || selectedRoleId === currentRoleId}
          className="rounded-[0px] bg-[var(--primary)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition-[transform,box-shadow] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)] disabled:pointer-events-none disabled:opacity-40"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        >
          {loading ? "Asignando..." : "Asignar rol"}
        </button>
      </CardContent>
    </Card>
  );
}
