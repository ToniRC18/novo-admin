"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function UserSearchInput({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const nextValue = value.trim();
      const currentValue = searchParams.get("q") ?? "";

      if (nextValue === currentValue) {
        return;
      }

      if (nextValue) {
        params.set("q", nextValue);
      } else {
        params.delete("q");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, value]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
      <Input
        className="pl-9"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar por nombre o email"
      />
    </div>
  );
}
