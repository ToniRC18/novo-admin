"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, KeyRound, ShieldCheck, Users, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

const navigation = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/negocios", label: "Negocios", icon: Building2 },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/roles", label: "Roles", icon: ShieldCheck },
  { href: "/dashboard/permisos", label: "Permisos", icon: KeyRound },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--outline-variant)] bg-[var(--surface-low)] lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[var(--on-surface)]/20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <aside
            className="h-full w-64 bg-[var(--surface-low)] shadow-[40px_0_80px_rgba(53,37,205,0.06)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[var(--on-surface)] transition-colors hover:bg-[var(--surface)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col gap-10 px-6 py-8">
      {/* Brand */}
      <div className="space-y-1 pb-6 border-b border-[var(--outline-variant)]">
        <p className="eyebrow tracking-[0.18em]">
          CodeTek
        </p>
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none">
          Novo Admin
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Backoffice interno · Novo Suite
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5">
        {navigation.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors border-l-2",
                "[font-family:var(--font-plus-jakarta),system-ui,sans-serif]",
                active
                  ? "border-[var(--primary)] bg-[var(--color-accent-soft)] text-[var(--primary)] font-semibold"
                  : "border-transparent text-[var(--on-surface)] hover:bg-[var(--surface)] hover:border-[var(--outline-variant)]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
