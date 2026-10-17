"use server";

import { redirect } from "next/navigation";

import { createAuthClient } from "@/lib/supabase/server";

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.trim();

  if (!email || !input.password) {
    return { ok: false, error: "Enter your email and password." };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    return { ok: false, error: "Wrong email or password." };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}