import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { RoleFormDialog } from "@/components/admin/role-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PRODUCTS } from "@/lib/admin-constants";
import { getPermisos, getRol } from "@/lib/novo-auth-api";
import { formatLabel } from "@/lib/utils";
import type { PermisoAdmin, ProductoNovo } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const roleResult = await getRol(id, "cards");

  if (!roleResult.ok) {
    return (
      <>
        <PageHeader eyebrow="Roles" title="Detalle de rol" description="Permisos y configuración del rol." />
        <ErrorPanel message={roleResult.message} />
      </>
    );
  }

  const role = roleResult.data;
  const permissionsResults = await Promise.all(PRODUCTS.map((product) => getPermisos(product)));
  const permissionsByProduct = Object.fromEntries(
    PRODUCTS.map((product, index) => [product, permissionsResults[index].ok ? permissionsResults[index].data : []]),
  ) as Record<ProductoNovo, PermisoAdmin[]>;

  return (
    <>
      <PageHeader
        eyebrow="Roles"
        title={role.nombre}
        description="Detalle del rol template y sus permisos activos."
        actions={
          <RoleFormDialog
            mode="edit"
            permissionsByProduct={permissionsByProduct}
            role={role}
            trigger={<Button>Editar rol</Button>}
          />
        }
      />

      <Card>
        <CardHeader>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]">Producto</p>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{formatLabel(role.producto)}</h2>
          {role.descripcion ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">{role.descripcion}</p>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {role.permisos.map((permiso) => (
              <Badge key={permiso} variant="secondary">
                {formatLabel(permiso)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
