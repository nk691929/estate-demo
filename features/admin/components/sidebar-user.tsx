import { connection } from "next/server";

import { createAuthClient } from "@/lib/supabase/server";

export async function SidebarUser() {
  await connection();

  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();
  const email = String(data?.claims?.email ?? "");

  if (!email) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold">
        {email.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{email}</p>
        <p className="text-xs text-foreground/50">Agent</p>
      </div>
    </div>
  );
}