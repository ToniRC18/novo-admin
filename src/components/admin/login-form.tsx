"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [masterKey, setMasterKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ masterKey }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(payload.message || "No fue posible iniciar sesión");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No fue posible contactar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-xs font-bold uppercase tracking-[0.1em] text-[var(--on-surface)]"
          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          htmlFor="master-key"
        >
          Clave maestra
        </label>
        <Input
          id="master-key"
          type="password"
          autoComplete="current-password"
          value={masterKey}
          onChange={(event) => setMasterKey(event.target.value)}
          placeholder="Ingresa la clave del operador"
          required
        />
      </div>

      {error ? (
        <p className="rounded-[4px] border border-[var(--error-border)] bg-[var(--error-surface)] px-3 py-2.5 text-sm text-[var(--error-text)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[0px] bg-[var(--primary)] py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition-[transform,box-shadow] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)] disabled:pointer-events-none disabled:opacity-50"
        style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      >
        {loading ? "Validando..." : "Entrar al backoffice"}
      </button>
    </form>
  );
}
