import { EmptyState } from "@/components/admin/empty-state";
import { ErrorPanel } from "@/components/admin/error-panel";
import { NegociosCrudPanel } from "@/components/admin/negocios-crud-panel";
import { PageHeader } from "@/components/admin/page-header";
import { getNegocios } from "@/lib/novo-auth-api";

export const dynamic = "force-dynamic";

export default async function NegociosPage() {
  const result = await getNegocios();

  return (
    <>
      <PageHeader
        eyebrow="Negocios"
        title="Negocios activos"
        description="Listado global de negocios con plan, productos activos y fecha de registro."
      />

      {!result.ok ? (
        <ErrorPanel message={result.message} />
      ) : !result.data.length ? (
        <EmptyState title="Sin negocios" description="No hay negocios registrados en novo-auth-api." />
      ) : (
        <NegociosCrudPanel businesses={result.data} />
      )}
    </>
  );
}
