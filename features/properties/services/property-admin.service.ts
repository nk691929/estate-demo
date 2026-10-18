import type { createAuthClient } from "@/lib/supabase/server";
import type { Property } from "../types";
import { toProperty, type PropertyRow } from "./property.service";

type AuthClient = Awaited<ReturnType<typeof createAuthClient>>;

export type AdminProperty = Property & { published: boolean };

type AdminRow = PropertyRow & { published: boolean };

function toAdminProperty(row: AdminRow): AdminProperty {
  return { ...toProperty(row), published: row.published };
}

export async function getPropertiesForAdmin(
  supabase: AuthClient
): Promise<AdminProperty[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id");

  if (error) throw new Error(`Could not load properties: ${error.message}`);

  return (data as AdminRow[]).map(toAdminProperty);
}

export async function getPropertyForEdit(
  supabase: AuthClient,
  id: string
): Promise<AdminProperty | undefined> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load property: ${error.message}`);

  return data ? toAdminProperty(data as AdminRow) : undefined;
}