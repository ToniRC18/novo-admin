import { NextResponse } from "next/server";

import { requireAdminSession, toErrorResponse } from "@/app/api/admin/_helpers";
import { deletePermiso, updatePermiso } from "@/lib/novo-auth-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    nombre?: string;
    descripcion?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ message: "Body inválido" }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updatePermiso({
    id,
    nombre: body.nombre,
    descripcion: body.descripcion,
  });

  if (!result.ok) {
    return toErrorResponse(
      result.message,
      result.message === "El permiso está en uso por uno o más roles" ? 409 : 502,
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { id } = await context.params;
  const result = await deletePermiso(id);

  if (!result.ok) {
    return toErrorResponse(
      result.message,
      result.message === "El permiso está en uso por uno o más roles" ? 409 : 502,
    );
  }

  return NextResponse.json({ ok: true });
}
