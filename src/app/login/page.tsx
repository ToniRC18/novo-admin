import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4 py-10">
      {/* Ambient glow — very subtle */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(53,37,205,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-[20px] bg-[var(--surface-lowest)] px-10 py-10"
          style={{
            boxShadow: "0 40px 80px rgba(53, 37, 205, 0.05)",
          }}
        >
          {/* Icon badge */}
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[0px] bg-[var(--primary)]">
            <LockKeyhole className="h-5 w-5 text-white" />
          </div>

          {/* Eyebrow */}
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          >
            CodeTek · Novo Suite
          </p>

          {/* Title */}
          <h1
            className="mb-1 text-4xl font-black tracking-[-0.02em] text-[var(--on-surface)] leading-none"
            style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
          >
            Novo Admin
          </h1>

          {/* Subtitle */}
          <p
            className="mb-8 text-sm text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            Panel interno del operador. Usa la clave maestra.
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
