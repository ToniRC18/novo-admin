import { Building2, ShieldCheck, Users } from "lucide-react";

import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getNegocios, getRoles, getUsuarios } from "@/lib/novo-auth-api";

export const dynamic = "force-dynamic";

const roleProducts = ["cards", "pos", "kitchen"] as const;

const statIcons = {
  Negocios: Building2,
  Usuarios: Users,
  Roles: ShieldCheck,
};

export default async function DashboardPage() {
  const [negociosResult, usuariosResult, ...rolesResults] = await Promise.all([
    getNegocios(),
    getUsuarios(),
    ...roleProducts.map((product) => getRoles(product)),
  ]);

  const errors = [
    !negociosResult.ok ? negociosResult.message : null,
    !usuariosResult.ok ? usuariosResult.message : null,
    ...rolesResults.map((result) => (!result.ok ? result.message : null)),
  ].filter(Boolean) as string[];

  const stats = [
    {
      label: "Negocios",
      value: negociosResult.ok ? negociosResult.data.length : 0,
      icon: Building2,
    },
    {
      label: "Usuarios",
      value: usuariosResult.ok ? usuariosResult.data.length : 0,
      icon: Users,
    },
    {
      label: "Roles",
      value: rolesResults.reduce((total, result) => total + (result.ok ? result.data.length : 0), 0),
      icon: ShieldCheck,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Resumen operativo"
        description="Conteos globales del backoffice sobre negocios, usuarios y catálogo de roles."
      />

      {errors.length ? (
        <ErrorPanel message={errors.join(" | ")} title="Parte del resumen no pudo cargarse" />
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)] mb-3"
                      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-5xl font-black tracking-[-0.03em] text-[var(--on-surface)] leading-none"
                      style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0px] bg-[var(--surface-low)] text-[var(--primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
