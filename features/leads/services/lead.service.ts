import type { createAuthClient } from "@/lib/supabase/server";
import type { Lead, LeadSource, LeadStatus } from "../types";

type AuthClient = Awaited<ReturnType<typeof createAuthClient>>;

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: LeadSource;
  property_id: string | null;
  property_title: string | null;
  status: LeadStatus;
  created_at: string;
};

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    message: row.message,
    source: row.source,
    propertyId: row.property_id ?? undefined,
    propertyTitle: row.property_title ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getLeads(supabase: AuthClient): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load leads: ${error.message}`);

  return (data as LeadRow[]).map(toLead);
}