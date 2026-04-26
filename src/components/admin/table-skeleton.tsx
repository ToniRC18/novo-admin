import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((__, columnIndex) => (
              <Skeleton key={columnIndex} className="h-9 w-full" />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
