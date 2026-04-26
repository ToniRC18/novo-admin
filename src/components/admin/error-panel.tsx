import { AlertCircle } from "lucide-react";

export function ErrorPanel({
  title = "No fue posible cargar esta sección",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="rounded-[0px] border border-[#c0392b]/30 bg-[#fdf2f2] px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9c2f2f]" />
        <div className="space-y-0.5">
          <p
            className="text-sm font-bold text-[#7a271a]"
            style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          >
            {title}
          </p>
          <p
            className="text-sm text-[#9c3d2f]"
            style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
