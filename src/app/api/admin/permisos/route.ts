import { NextResponse } from "next/server";

import { requireAdminSession, toErrorResponse } from "@/app/api/admin/_helpers";
import { createPermiso } from "@/lib/novo-auth-api";

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    producto?: "cards" | "pos" | "kitchen";
    clave?: string;
    nombre?: string;
    descripcion?: string;
  } | null;

  if (!body?.producto || !body.clave || !body.nombre) {
    return NextResponse.json({ message: "Faltan datos para crear el permiso" }, { status: 400 });
  }

  const result = await createPermiso({
    producto: body.producto,
    clave: body.clave,
    nombre: body.nombre,
    descripcion: body.descripcion,
  });

  if (!result.ok) {
    return toErrorResponse(result.message);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
