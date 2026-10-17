import { redirect } from "next/navigation";
import { connection } from "next/server";

import { createAuthClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  await connection();

  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) redirect("/admin/login");

  return { supabase, email: String(data.claims.email ?? "") };
}