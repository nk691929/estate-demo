import Link from "next/link";

import { signOut } from "@/features/auth/actions";
import { requireAdmin } from "@/features/auth/require-admin";

export default async function AdminPage() {
  const { email } = await requireAdmin();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-foreground/70">Signed in as {email}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/leads"
          className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          View leads
        </Link>
        <Link
          href="/admin/properties"
          className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          Manage properties
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-foreground/20 px-5 py-3 text-sm transition hover:bg-foreground/5"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}