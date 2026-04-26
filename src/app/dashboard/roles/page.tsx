import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { RoleFormDialog } from "@/components/admin/role-form-dialog";
import { RolesCrudPanel } from "@/components/admin/roles-crud-panel";
import { Button } from "@/components/ui/button";
import { getPermisos, getRoles } from "@/lib/novo-auth-api";
import type { PermisoAdmin, ProductoNovo, RolAdmin } from "@/types/admin";

export const dynamic = "force-dynamic";

const products: ProductoNovo[] = ["cards", "pos", "kitchen"];

export default async function RolesPage() {
  const [rolesResults, permisosResults] = await Promise.all([
    Promise.all(products.map((product) => getRoles(product))),
    Promise.all(products.map((product) => getPermisos(product))),
  ]);
  const errors = [...rolesResults, ...permisosResults]
    .map((result) => (!result.ok ? result.message : null))
    .filter(Boolean) as string[];

  const rolesByProduct = Object.fromEntries(
    products.map((product, index) => [product, rolesResults[index].ok ? rolesResults[index].data : []]),
  ) as Record<ProductoNovo, RolAdmin[]>;

  const permissionsByProduct = Object.fromEntries(
    products.map((product, index) => [product, permisosResults[index].ok ? permisosResults[index].data : []]),
  ) as Record<ProductoNovo, PermisoAdmin[]>;

  return (
    <>
      <PageHeader
        eyebrow="Catálogo / Roles"
        title="Roles por producto"
        description="Crea, edita y elimina roles template con permisos por producto."
        actions={
          <RoleFormDialog
            mode="create"
            permissionsByProduct={permissionsByProduct}
            trigger={<Button>Nuevo rol</Button>}
          />
        }
      />

      {errors.length ? <ErrorPanel message={errors.join(" | ")} /> : null}

      <RolesCrudPanel permissionsByProduct={permissionsByProduct} rolesByProduct={rolesByProduct} />
    </>
  );
}
