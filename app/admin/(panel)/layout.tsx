import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";

import { AdminNav } from "@/features/auth/components/admin-nav";
import { signOut } from "@/features/auth/actions";
import { siteConfig } from "@/config/site";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/admin" className="font-bold">
            {siteConfig.name}{" "}
            <span className="text-sm font-normal text-foreground/50">Admin</span>
          </Link>

          <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
            <AdminNav />
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              View site
            </Link>

            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </>
  );
}