import { NextResponse } from "next/server";

import { requireAdminSession, toErrorResponse } from "@/app/api/admin/_helpers";
import { createUsuario } from "@/lib/novo-auth-api";

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const body = (await request.json().catch(() => null)) as {
    nombre?: string;
    email?: string;
    password?: string;
    rolGlobal?: string;
    negocioId?: string;
    productos?: string[];
  } | null;

  if (!body?.nombre || !body.email || !body.password || !body.rolGlobal || !body.negocioId) {
    return NextResponse.json({ message: "Faltan datos para crear el usuario" }, { status: 400 });
  }

  const result = await createUsuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
    rolGlobal: body.rolGlobal,
    negocioId: body.negocioId,
    productos: body.productos ?? [],
  });

  if (!result.ok) {
    return toErrorResponse(result.message);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
