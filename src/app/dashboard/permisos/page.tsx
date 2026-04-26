import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PermisoFormDialog } from "@/components/admin/permiso-form-dialog";
import { PermisosCrudPanel } from "@/components/admin/permisos-crud-panel";
import { Button } from "@/components/ui/button";
import { getPermisos } from "@/lib/novo-auth-api";
import type { PermisoAdmin, ProductoNovo } from "@/types/admin";

export const dynamic = "force-dynamic";

const products: ProductoNovo[] = ["cards", "pos", "kitchen"];

export default async function PermisosPage() {
  const results = await Promise.all(products.map((product) => getPermisos(product)));
  const errors = results
    .map((result) => (!result.ok ? result.message : null))
    .filter(Boolean) as string[];

  const permissionsByProduct = Object.fromEntries(
    products.map((product, index) => [product, results[index].ok ? results[index].data : []]),
  ) as Record<ProductoNovo, PermisoAdmin[]>;

  return (
    <>
      <PageHeader
        eyebrow="Catálogo / Permisos"
        title="Permisos por producto"
        description="Crea, edita y elimina permisos del catálogo agrupados por producto."
        actions={<PermisoFormDialog mode="create" trigger={<Button>Nuevo permiso</Button>} />}
      />

      {errors.length ? <ErrorPanel message={errors.join(" | ")} /> : null}

      <PermisosCrudPanel permissionsByProduct={permissionsByProduct} />
    </>
  );
}
