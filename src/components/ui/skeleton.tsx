import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[4px] bg-[var(--surface-low)] [animation:skeleton-pulse_1.8s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    />
  );
}
