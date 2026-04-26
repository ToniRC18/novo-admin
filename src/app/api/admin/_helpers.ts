import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Sesión administrativa inválida" }, { status: 401 });
  }

  return null;
}

export function toErrorResponse(message: string, status = 502) {
  return NextResponse.json({ message }, { status });
}
