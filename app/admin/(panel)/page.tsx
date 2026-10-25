import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Inbox,
  Plus,
} from "lucide-react";

import { ChartCard } from "@/features/admin/components/charts/chart-card";
import { LeadsOverTime } from "@/features/admin/components/charts/leads-over-time";
import { PipelineChart } from "@/features/admin/components/charts/pipeline-chart";
import { SourceDonut } from "@/features/admin/components/charts/source-donut";
import { StatCard } from "@/features/admin/components/stat-card";
import { getChartData } from "@/features/admin/services/chart.service";
import { getDashboardStats } from "@/features/admin/services/dashboard.service";
import { requireAdmin } from "@/features/auth/require-admin";
import { statusStyles } from "@/features/leads/status-styles";

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeZone: "Asia/Karachi",
});

const leadDateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Karachi",
});

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const [stats, charts] = await Promise.all([
    getDashboardStats(supabase),
    getChartData(supabase),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-foreground/60">{dayFormat.format(new Date())}</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          <Plus className="size-4" />
          Add a property
        </Link>
      </div>

      {stats.waitingOver24h > 0 && (
        <Link
          href="/admin/leads?status=new"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-4 text-sm transition hover:bg-yellow-500/10"
        >
          <AlertCircle className="size-5 shrink-0 text-yellow-400" />
          <span className="flex-1">
            <strong>
              {stats.waitingOver24h} new{" "}
              {stats.waitingOver24h === 1 ? "lead has" : "leads have"}
            </strong>{" "}
            been waiting for more than 24 hours.
          </span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="New leads"
          value={stats.newLeads}
          hint="Waiting for a first reply"
          icon={Inbox}
          tone="blue"
          href="/admin/leads?status=new"
        />
        <StatCard
          label="Leads this week"
          value={stats.leadsThisWeek}
          hint="Last 7 days"
          icon={CalendarDays}
          href="/admin/leads"
        />
        <StatCard
          label="Active listings"
          value={stats.published}
          hint="Visible on the website"
          icon={Building2}
          tone="green"
          href="/admin/properties"
        />
        <StatCard
          label="Drafts"
          value={stats.drafts}
          hint="Hidden from visitors"
          icon={FileText}
          tone="yellow"
          href="/admin/properties"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Leads per day"
          subtitle="Last 30 days, Pakistan time. Archived leads are not counted."
          className="lg:col-span-2"
        >
          <LeadsOverTime days={charts.days} />
        </ChartCard>

        <ChartCard title="Lead sources" subtitle="Where active leads come from">
          <SourceDonut items={charts.sources} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-foreground/10 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent leads</h2>
            <Link
              href="/admin/leads"
              className="text-sm text-foreground/70 underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {stats.recentLeads.length === 0 ? (
            <p className="py-10 text-center text-sm text-foreground/60">
              No leads yet. They appear here when someone sends an inquiry.
            </p>
          ) : (
            <ul className="divide-y divide-foreground/10">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href="/admin/leads"
                    className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {lead.name}
                      </span>
                      <span className="block truncate text-xs text-foreground/50">
                        {lead.propertyTitle ?? "Contact form"} ·{" "}
                        {leadDateFormat.format(new Date(lead.createdAt))}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ChartCard title="Pipeline" subtitle="Active leads by stage">
          <PipelineChart items={charts.pipeline} />
        </ChartCard>
      </div>
    </main>
  );
}