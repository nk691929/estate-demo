import type { createAuthClient } from "@/lib/supabase/server";
import type { Property } from "../types";
import { toProperty, type PropertyRow } from "./property.service";

type AuthClient = Awaited<ReturnType<typeof createAuthClient>>;

export async function getPropertiesForAdmin(
  supabase: AuthClient
): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id");

  if (error) throw new Error(`Could not load properties: ${error.message}`);

  return (data as PropertyRow[]).map(toProperty);
}

export async function getPropertyForEdit(
  supabase: AuthClient,
  id: string
): Promise<Property | undefined> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load property: ${error.message}`);

  return data ? toProperty(data as PropertyRow) : undefined;
}