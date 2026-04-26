import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";

export default function DashboardLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Cargando"
        title="Preparando vista"
        description="Obteniendo datos del backoffice."
      />
      <TableSkeleton rows={4} columns={3} />
    </>
  );
}
