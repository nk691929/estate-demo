import type { LeadSource, LeadStatus } from "@/features/leads/types";
import type { createAuthClient } from "@/lib/supabase/server";

type AuthClient = Awaited<ReturnType<typeof createAuthClient>>;

export type DayPoint = { key: string; label: string; count: number };

export type ChartData = {
  days: DayPoint[];
  pipeline: { status: LeadStatus; label: string; count: number }[];
  sources: { source: LeadSource; label: string; count: number }[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = 30;

const keyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const labelFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Karachi",
  day: "numeric",
  month: "short",
});

const statusList: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "viewing", label: "Viewing" },
  { status: "negotiating", label: "Negotiating" },
  { status: "won", label: "Won" },
  { status: "lost", label: "Lost" },
];

const sourceList: { source: LeadSource; label: string }[] = [
  { source: "property", label: "Property inquiries" },
  { source: "contact", label: "Contact form" },
];

export async function getChartData(supabase: AuthClient): Promise<ChartData> {
  const now = Date.now();
  const since = new Date(now - DAYS * DAY_MS).toISOString();
  const countOnly = { count: "exact", head: true } as const;

  const [pipelineResults, sourceResults, recent] = await Promise.all([
    Promise.all(
      statusList.map(({ status }) =>
        supabase
          .from("leads")
          .select("id", countOnly)
          .eq("archived", false)
          .eq("status", status)
      )
    ),
    Promise.all(
      sourceList.map(({ source }) =>
        supabase
          .from("leads")
          .select("id", countOnly)
          .eq("archived", false)
          .eq("source", source)
      )
    ),
    supabase
      .from("leads")
      .select("created_at")
      .eq("archived", false)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(1000),
  ]);

  for (const result of [...pipelineResults, ...sourceResults, recent]) {
    if (result.error) {
      throw new Error(`Could not load chart data: ${result.error.message}`);
    }
  }

  const perDay = new Map<string, number>();
  for (const row of recent.data as { created_at: string }[]) {
    const key = keyFormat.format(new Date(row.created_at));
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const days: DayPoint[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const moment = new Date(now - i * DAY_MS);
    const key = keyFormat.format(moment);
    days.push({
      key,
      label: labelFormat.format(moment),
      count: perDay.get(key) ?? 0,
    });
  }

  return {
    days,
    pipeline: statusList.map((item, index) => ({
      ...item,
      count: pipelineResults[index].count ?? 0,
    })),
    sources: sourceList.map((item, index) => ({
      ...item,
      count: sourceResults[index].count ?? 0,
    })),
  };
}