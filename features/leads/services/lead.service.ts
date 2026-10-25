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
  notes: string;
  archived: boolean;
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
    notes: row.notes,
    archived: row.archived
  };
}

export async function getLeads(
  supabase: AuthClient,
  options: { archived: boolean; status?: LeadStatus; limit?: number }
): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*")
    .eq("archived", options.archived)
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 200);

  if (options.status) query = query.eq("status", options.status);

  const { data, error } = await query;

  if (error) throw new Error(`Could not load leads: ${error.message}`);

  return (data as LeadRow[]).map(toLead);
}

export type LeadCounts = {
  active: number;
  archived: number;
  byStatus: Record<LeadStatus, number>;
};

export async function getLeadCounts(supabase: AuthClient): Promise<LeadCounts> {
  const { data, error } = await supabase
    .from("leads")
    .select("status, archived");

  if (error) throw new Error(`Could not count leads: ${error.message}`);

  const counts: LeadCounts = {
    active: 0,
    archived: 0,
    byStatus: {
      new: 0,
      contacted: 0,
      viewing: 0,
      negotiating: 0,
      won: 0,
      lost: 0,
    },
  };

  for (const row of data as { status: LeadStatus; archived: boolean }[]) {
    if (row.archived) {
      counts.archived += 1;
    } else {
      counts.active += 1;
      counts.byStatus[row.status] += 1;
    }
  }

  return counts;
}