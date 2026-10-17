"use server";

import { updateTag } from "next/cache";

import { createAuthClient } from "@/lib/supabase/server";
import { parsePropertyForm, type PropertyFormValues } from "./validation";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function updateProperty(
  id: string,
  values: PropertyFormValues
): Promise<SaveResult> {
  const parsed = parsePropertyForm(values);
  if (!parsed.ok) return parsed;

  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  const { data, error } = await supabase
    .from("properties")
    .update(parsed.data)
    .eq("id", id)
    .select("slug");

  if (error || !data || data.length === 0) {
    return { ok: false, error: "Could not save changes." };
  }

  updateTag("properties");
  updateTag(`property-${data[0].slug}`);

  return { ok: true };
}