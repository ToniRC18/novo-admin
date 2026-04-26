import Link from "next/link";

import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { ProductBadges } from "@/components/admin/product-badges";
import { RoleAssignmentCard } from "@/components/admin/role-assignment-card";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getNegocios, getRoles, getUsuario, getUsuarioAccesos } from "@/lib/novo-auth-api";
import { formatLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const products = ["cards", "pos", "kitchen"] as const;

export default async function UsuarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [userResult, accesosResult, negociosResult, ...rolesResults] = await Promise.all([
    getUsuario(id),
    getUsuarioAccesos(id),
    getNegocios(),
    ...products.map((product) => getRoles(product)),
  ]);

  if (!userResult.ok) {
    return (
      <>
        <PageHeader eyebrow="Usuarios" title="Detalle de usuario" description="Carga de accesos y roles por producto." />
        <ErrorPanel message={userResult.message} />
      </>
    );
  }

  const user = userResult.data;
  const accesos = accesosResult.ok ? accesosResult.data : user.accesos || {};
  const activeProducts = Object.keys(accesos);
  const negocioId = user.negocio?.id || user.negocioId || "";

  return (
    <>
      <PageHeader
        eyebrow="Usuarios"
        title={user.nombre}
        description="Detalle de accesos por producto y asignación controlada de roles."
        actions={
          negociosResult.ok ? (
            <UserFormDialog
              businesses={negociosResult.data}
              mode="edit"
              trigger={<Button>Editar usuario</Button>}
              user={{ ...user, productos: activeProducts }}
            />
          ) : null
        }
      />

      {!accesosResult.ok ? (
        <ErrorPanel
          title="No fue posible cargar accesos actuales"
          message={accesosResult.message}
        />
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        {/* General data */}
        <Card>
          <CardHeader>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Perfil
            </p>
            <h2
              className="text-2xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none"
              style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
            >
              Datos generales
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  Email
                </p>
                <p
                  className="font-medium text-[var(--on-surface)] text-sm"
                  style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
                >
                  {user.email}
                </p>
              </div>
              <div>
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  Rol global
                </p>
                <span
                  className="inline-flex items-center rounded-[0px] border border-[var(--outline-variant)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--on-surface)]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  {user.rolGlobal}
                </span>
              </div>
              <div>
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  Negocio
                </p>
                {user.negocio ? (
                  <Link
                    className="font-medium text-[var(--primary)] underline-offset-4 hover:underline text-sm"
                    href={`/dashboard/negocios/${user.negocio.id}`}
                    style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
                  >
                    {user.negocio.nombre}
                  </Link>
                ) : (
                  <p
                    className="font-medium text-sm text-[var(--color-muted-foreground)]"
                    style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
                  >
                    Sin negocio
                  </p>
                )}
              </div>
              <div>
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                  style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                >
                  Productos con acceso
                </p>
                <ProductBadges products={activeProducts} />
              </div>
            </div>

            {/* Current permissions */}
            <div>
              <p
                className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                Permisos actuales
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(accesos).flatMap(([producto, acceso]) =>
                  acceso.permisos.map((permiso) => (
                    <Badge key={`${producto}-${permiso}`} variant="default">
                      {formatLabel(producto)} · {formatLabel(permiso)}
                    </Badge>
                  )),
                )}
                {!Object.keys(accesos).length ? (
                  <span
                    className="text-sm text-[var(--color-muted-foreground)]"
                    style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
                  >
                    Sin accesos registrados
                  </span>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role assignment column */}
        <div className="grid gap-5 content-start">
          {products.map((product, index) => {
            const rolesResult = rolesResults[index];
            const currentAccess = accesos[product];

            if (!rolesResult.ok) {
              return (
                <ErrorPanel
                  key={product}
                  title={`No fue posible cargar roles de ${formatLabel(product)}`}
                  message={rolesResult.message}
                />
              );
            }

            return (
              <RoleAssignmentCard
                key={product}
                negocioId={negocioId}
                producto={product}
                currentRoleId={currentAccess?.rolId}
                currentRoleName={currentAccess?.rol}
                roles={rolesResult.data}
                userId={user.id}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
