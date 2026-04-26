import { Badge } from "@/components/ui/badge";
import { formatLabel } from "@/lib/utils";

export function ProductBadges({ products }: { products: string[] }) {
  if (!products.length) {
    return (
      <span
        className="text-xs text-[var(--color-muted-foreground)]"
        style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
      >
        Sin productos activos
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {products.map((product) => (
        <Badge key={product}>{formatLabel(product)}</Badge>
      ))}
    </div>
  );
}
