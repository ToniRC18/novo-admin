import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "novo_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecretKey() {
  return new TextEncoder().encode(env.adminSecret);
}

export async function createAdminSessionToken() {
  return new SignJWT({ scope: "novo-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ["HS256"],
  });

  if (payload.scope !== "novo-admin") {
    throw new Error("Invalid session scope");
  }

  return payload;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    await verifyAdminSessionToken(token);
    return { token };
  } catch {
    return null;
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
