import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-[var(--surface)]">
        <DashboardHeader />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
