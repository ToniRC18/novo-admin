"use client";

import Link from "next/link";

import { DeleteIconButton, EditIconButton } from "@/components/admin/crud-actions";
import { NegocioDeleteDialog } from "@/components/admin/negocio-delete-dialog";
import { NegocioFormDialog } from "@/components/admin/negocio-form-dialog";
import { ProductBadges } from "@/components/admin/product-badges";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { NegocioAdmin } from "@/types/admin";

export function NegociosCrudPanel({ businesses }: { businesses: NegocioAdmin[] }) {
  return (
    <Card>
      <CardContent className="p-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Productos activos</TableHead>
              <TableHead>Fecha registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>
                  <Link
                    className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
                    href={`/dashboard/negocios/${business.id}`}
                  >
                    {business.nombre}
                  </Link>
                </TableCell>
                <TableCell className="uppercase">{business.plan}</TableCell>
                <TableCell>
                  <ProductBadges products={business.productosActivos} />
                </TableCell>
                <TableCell className="text-[var(--color-muted-foreground)]">
                  {formatDate(business.fechaRegistro)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <NegocioFormDialog
                      business={business}
                      trigger={<EditIconButton label={`Editar negocio ${business.nombre}`} />}
                    />
                    <NegocioDeleteDialog
                      business={business}
                      trigger={<DeleteIconButton label={`Eliminar negocio ${business.nombre}`} />}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
