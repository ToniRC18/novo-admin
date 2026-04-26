"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-[0px] border border-[var(--outline-variant)] bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--on-surface)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[2px_2px_0px_var(--on-surface)] disabled:pointer-events-none disabled:opacity-50"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
