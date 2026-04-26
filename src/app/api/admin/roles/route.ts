import { NextResponse } from "next/server";

import { requireAdminSession, toErrorResponse } from "@/app/api/admin/_helpers";
import { createRol } from "@/lib/novo-auth-api";

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    producto?: "cards" | "pos" | "kitchen";
    nombre?: string;
    descripcion?: string;
    permisoIds?: string[];
  } | null;

  if (!body?.producto || !body.nombre || !Array.isArray(body.permisoIds)) {
    return NextResponse.json({ message: "Faltan datos para crear el rol" }, { status: 400 });
  }

  const result = await createRol({
    producto: body.producto,
    nombre: body.nombre,
    descripcion: body.descripcion,
    permisoIds: body.permisoIds,
  });

  if (!result.ok) {
    return toErrorResponse(result.message);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
