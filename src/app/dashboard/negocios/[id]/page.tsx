import Link from "next/link";

import { EmptyState } from "@/components/admin/empty-state";
import { ErrorPanel } from "@/components/admin/error-panel";
import { NegocioFormDialog } from "@/components/admin/negocio-form-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { ProductBadges } from "@/components/admin/product-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getNegocio } from "@/lib/novo-auth-api";
import { formatLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const products = ["cards", "pos", "kitchen"] as const;

export default async function NegocioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getNegocio(id);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Negocios" title="Detalle de negocio" description="Usuarios, roles globales y accesos por producto." />
        <ErrorPanel message={result.message} />
      </>
    );
  }

  const business = result.data;
  const users = business.usuarios || [];

  return (
    <>
      <PageHeader
        eyebrow="Negocios"
        title={business.nombre}
        description="Detalle operativo del negocio, sus productos y el desglose de accesos por usuario."
        actions={<NegocioFormDialog business={business} trigger={<Button>Editar negocio</Button>} />}
      />

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Business data card */}
        <Card>
          <CardHeader>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Información
            </p>
            <h2
              className="text-2xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none"
              style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
            >
              Datos del negocio
            </h2>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                Nombre
              </p>
              <p
                className="font-medium text-[var(--on-surface)]"
                style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
              >
                {business.nombre}
              </p>
            </div>
            <div>
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                Plan
              </p>
              <span
                className="inline-flex items-center rounded-[0px] border border-[var(--outline-variant)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--on-surface)]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                {business.plan}
              </span>
            </div>
            <div className="md:col-span-2">
              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
              >
                Productos activos
              </p>
              <ProductBadges products={business.productosActivos} />
            </div>
          </CardContent>
        </Card>

        {/* Users card */}
        <Card>
          <CardHeader>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
            >
              Directorio
            </p>
            <h2
              className="text-2xl font-extrabold tracking-[-0.02em] text-[var(--on-surface)] leading-none"
              style={{ fontFamily: "var(--font-epilogue), system-ui, sans-serif" }}
            >
              Usuarios asociados
            </h2>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            {!users.length ? (
              <div className="px-6 pb-6">
                <EmptyState title="Sin usuarios" description="Este negocio todavía no tiene usuarios asociados." />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol global</TableHead>
                    {products.map((product) => (
                      <TableHead key={product}>{formatLabel(product)}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Link
                          className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                          href={`/dashboard/usuarios/${user.id}`}
                        >
                          {user.nombre}
                        </Link>
                      </TableCell>
                      <TableCell className="text-[var(--color-muted-foreground)]">{user.email}</TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center rounded-[0px] border border-[var(--outline-variant)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                        >
                          {user.rolGlobal}
                        </span>
                      </TableCell>
                      {products.map((product) => (
                        <TableCell key={`${user.id}-${product}`}>
                          {user.accesos?.[product]?.rol ? (
                            <Badge variant="default">{user.accesos[product].rol}</Badge>
                          ) : (
                            <span
                              className="text-xs text-[var(--color-muted-foreground)]"
                              style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
                            >
                              Sin acceso
                            </span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
