import { Suspense } from "react";

import { siteConfig } from "@/config/site";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { SidebarUser } from "@/features/admin/components/sidebar-user";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell
      brand={siteConfig.name}
      user={
        <Suspense fallback={null}>
          <SidebarUser />
        </Suspense>
      }
    >
      {children}
    </AdminShell>
  );
}