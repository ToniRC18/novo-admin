"use client";

import { Menu } from "lucide-react";

import { LogoutButton } from "@/components/admin/logout-button";
import { useUiStore } from "@/store/ui-store";

export function DashboardHeader() {
  const { setMobileSidebarOpen } = useUiStore();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--outline-variant)] bg-[var(--surface-low)]">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[0px] text-[var(--on-surface)] transition-colors hover:bg-[var(--surface)] lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-sm font-medium text-[var(--on-surface)]">
              Panel operativo
            </p>
            <p className="font-data text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
              Acceso con token de servicio
            </p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
