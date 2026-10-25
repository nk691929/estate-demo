import { getLeads } from "@/features/leads/services/lead.service";
import type { Lead } from "@/features/leads/types";
import type { createAuthClient } from "@/lib/supabase/server";

type AuthClient = Awaited<ReturnType<typeof createAuthClient>>;

export type DashboardStats = {
  newLeads: number;
  leadsThisWeek: number;
  waitingOver24h: number;
  published: number;
  drafts: number;
  recentLeads: Lead[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getDashboardStats(
  supabase: AuthClient
): Promise<DashboardStats> {
  const now = Date.now();
  const weekAgo = new Date(now - 7 * DAY_MS).toISOString();
  const dayAgo = new Date(now - DAY_MS).toISOString();

  const countOnly = { count: "exact", head: true } as const;

  const [newLeads, week, waiting, published, drafts, recentLeads] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id", countOnly)
        .eq("archived", false)
        .eq("status", "new"),
      supabase
        .from("leads")
        .select("id", countOnly)
        .eq("archived", false)
        .gte("created_at", weekAgo),
      supabase
        .from("leads")
        .select("id", countOnly)
        .eq("archived", false)
        .eq("status", "new")
        .lt("created_at", dayAgo),
      supabase
        .from("properties")
        .select("id", countOnly)
        .eq("published", true),
      supabase
        .from("properties")
        .select("id", countOnly)
        .eq("published", false),
      getLeads(supabase, { archived: false, limit: 5 }),
    ]);

  for (const result of [newLeads, week, waiting, published, drafts]) {
    if (result.error) {
      throw new Error(`Could not load dashboard numbers: ${result.error.message}`);
    }
  }

  return {
    newLeads: newLeads.count ?? 0,
    leadsThisWeek: week.count ?? 0,
    waitingOver24h: waiting.count ?? 0,
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
    recentLeads,
  };
}