"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { signOut } from "@/features/auth/actions";

type NavItem = { href: string; label: string; icon: LucideIcon };

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

const footerLink =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground";

function SidebarContent({
  brand,
  user,
  collapsed,
  onNavigate,
  onToggleCollapse,
}: {
  brand: string;
  user: React.ReactNode;
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-foreground/10 px-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
          <Building2 className="size-5" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{brand}</p>
            <p className="text-xs text-foreground/50">Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${collapsed ? "justify-center" : ""
                } ${active
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-foreground/10 p-3">
        {!collapsed && user}

        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          title={collapsed ? "View site" : undefined}
          aria-label={collapsed ? "View site" : undefined}
          className={`${footerLink} ${collapsed ? "justify-center" : ""}`}
        >
          <ExternalLink className="size-5 shrink-0" />
          {!collapsed && "View site"}
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            aria-label={collapsed ? "Sign out" : undefined}
            className={`${footerLink} ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="size-5 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </form>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`${footerLink} ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? (
              <ChevronsRight className="size-5 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="size-5 shrink-0" />
                Collapse
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminShell({
  brand,
  user,
  children,
}: {
  brand: string;
  user: React.ReactNode;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage can be unavailable. The sidebar simply starts expanded.
    }
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Not saving the preference is fine.
    }
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <aside
        className={`hidden shrink-0 border-r border-foreground/10 bg-foreground/[0.03] transition-[width] duration-200 lg:sticky lg:top-0 lg:block lg:h-screen ${collapsed ? "lg:w-[72px]" : "lg:w-64"
          }`}
      >
        <SidebarContent
          brand={brand}
          user={user}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-foreground/10 bg-background/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="flex size-10 items-center justify-center rounded-lg border border-foreground/20"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-semibold">{brand}</span>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-foreground/10 bg-background shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-lg border border-foreground/20"
            >
              <X className="size-4" />
            </button>
            <SidebarContent
              brand={brand}
              user={user}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div id="main-content" tabIndex={-1} className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}