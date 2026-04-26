import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
} from "@/lib/admin-auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { masterKey?: string } | null;

  if (!body?.masterKey) {
    return NextResponse.json({ message: "La clave maestra es obligatoria" }, { status: 400 });
  }

  if (body.masterKey !== env.adminSecret) {
    return NextResponse.json({ message: "Clave maestra inválida" }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}
