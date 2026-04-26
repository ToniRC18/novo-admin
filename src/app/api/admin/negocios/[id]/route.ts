import { NextResponse } from "next/server";

import { requireAdminSession, toErrorResponse } from "@/app/api/admin/_helpers";
import { deleteNegocio, updateNegocio } from "@/lib/novo-auth-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    nombre?: string;
    plan?: string;
    productos?: string[];
  } | null;

  if (!body) {
    return NextResponse.json({ message: "Body inválido" }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updateNegocio({
    id,
    nombre: body.nombre,
    plan: body.plan,
    productos: body.productos,
  });

  if (!result.ok) {
    return toErrorResponse(result.message);
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
  const result = await deleteNegocio(id);

  if (!result.ok) {
    return toErrorResponse(result.message);
  }

  return NextResponse.json({ ok: true });
}
