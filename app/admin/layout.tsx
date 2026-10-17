import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<p className="p-8 text-center text-foreground/60">Loading...</p>}
    >
      {children}
    </Suspense>
  );
}