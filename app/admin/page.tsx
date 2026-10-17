import { redirect } from "next/navigation";

import { signOut } from "@/features/auth/actions";
import { createAuthClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export default async function AdminPage() {
  await connection();
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-foreground/70">
        Signed in as {String(data.claims.email ?? "agent")}
      </p>

      <form action={signOut} className="mt-6">
        <button
          type="submit"
          className="rounded-lg border border-foreground/20 px-4 py-2 text-sm transition hover:bg-foreground/5"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}