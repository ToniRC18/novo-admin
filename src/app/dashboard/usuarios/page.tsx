import { EmptyState } from "@/components/admin/empty-state";
import { ErrorPanel } from "@/components/admin/error-panel";
import { PageHeader } from "@/components/admin/page-header";
import { UserSearchInput } from "@/components/admin/user-search-input";
import { UserFormDialog } from "@/components/admin/user-form-dialog";
import { UsersCrudPanel } from "@/components/admin/users-crud-panel";
import { Button } from "@/components/ui/button";
import { getNegocios, getUsuarios } from "@/lib/novo-auth-api";

export const dynamic = "force-dynamic";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [result, negociosResult] = await Promise.all([getUsuarios({ q }), getNegocios()]);
  const businesses = negociosResult.ok ? negociosResult.data : [];

  return (
    <>
      <PageHeader
        eyebrow="Usuarios"
        title="Directorio global"
        description="Búsqueda global de usuarios por nombre o email dentro de Novo Suite."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <UserSearchInput key={q} initialValue={q} />
            {negociosResult.ok ? (
              <UserFormDialog
                businesses={businesses}
                mode="create"
                trigger={<Button>Nuevo usuario</Button>}
              />
            ) : null}
          </div>
        }
      />

      {!negociosResult.ok ? <ErrorPanel message={negociosResult.message} /> : null}

      {!result.ok ? (
        <ErrorPanel message={result.message} />
      ) : !result.data.length ? (
        <EmptyState
          title="Sin resultados"
          description={q ? "No hay usuarios para ese criterio de búsqueda." : "No hay usuarios registrados."}
        />
      ) : (
        <UsersCrudPanel businesses={businesses} users={result.data} />
      )}
    </>
  );
}
