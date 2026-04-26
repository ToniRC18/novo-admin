import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import { updateUsuarioRol } from "@/lib/novo-auth-api";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Sesión administrativa inválida" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    negocioId?: string;
    producto?: string;
    rolId?: string;
  } | null;

  if (!body?.negocioId || !body.producto || !body.rolId) {
    return NextResponse.json({ message: "Faltan datos para asignar el rol" }, { status: 400 });
  }

  const { id } = await context.params;
  const result = await updateUsuarioRol({
    id,
    negocioId: body.negocioId,
    producto: body.producto,
    rolId: body.rolId,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
