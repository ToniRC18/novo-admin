import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyAdminSessionToken(token);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
