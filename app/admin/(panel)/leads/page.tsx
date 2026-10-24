import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { requireAdmin } from "@/features/auth/require-admin";
import { ArchiveButton } from "@/features/leads/components/archive-button";
import { LeadEditor } from "@/features/leads/components/lead-editor";
import {
  getLeadCounts,
  getLeads,
} from "@/features/leads/services/lead.service";
import type { LeadStatus } from "@/features/leads/types";

const statusFilters: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "viewing", label: "Viewing" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-400",
  contacted: "bg-yellow-500/15 text-yellow-400",
  viewing: "bg-purple-500/15 text-purple-400",
  negotiating: "bg-orange-500/15 text-orange-400",
  won: "bg-green-500/15 text-green-400",
  lost: "bg-foreground/10 text-foreground/60",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Karachi",
});

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

const chip = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm transition ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/20 hover:bg-foreground/5"
  }`;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const archivedView = params.view === "archived";
  const status = statusFilters.find((item) => item.value === params.status)
    ?.value;

  const [leads, counts] = await Promise.all([
    getLeads(supabase, { archived: archivedView, status }),
    getLeadCounts(supabase),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Leads</h1>
      <p className="mb-6 mt-1 text-foreground/60">
        {counts.active} active, {counts.archived} archived
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/admin/leads" className={chip(!archivedView && !status)}>
          All active ({counts.active})
        </Link>
        {statusFilters.map((item) => (
          <Link
            key={item.value}
            href={`/admin/leads?status=${item.value}`}
            className={chip(!archivedView && status === item.value)}
          >
            {item.label} ({counts.byStatus[item.value]})
          </Link>
        ))}
        <Link
          href="/admin/leads?view=archived"
          className={`${chip(archivedView)} ml-auto`}
        >
          Archived ({counts.archived})
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 py-16 text-center text-foreground/60">
          {archivedView
            ? "No archived leads."
            : status
              ? "No leads with this status."
              : "No leads yet. They appear here when someone sends an inquiry."}
        </p>
      ) : (
        <ul className="space-y-4">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="rounded-2xl border border-foreground/10 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{lead.name}</p>
                  <p className="text-xs text-foreground/50">
                    {dateFormat.format(new Date(lead.createdAt))} ·{" "}
                    {lead.source === "property"
                      ? "Property inquiry"
                      : "Contact form"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[lead.status]}`}
                >
                  {lead.status}
                </span>
              </div>

              {lead.propertyTitle && (
                <p className="mt-3 text-sm">
                  <span className="text-foreground/50">About: </span>
                  {lead.propertyTitle}
                </p>
              )}

              {lead.message && (
                <p className="mt-2 text-sm text-foreground/70">{lead.message}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
                >
                  <Phone className="size-4" />
                  {lead.phone}
                </a>
                <a
                  href={`https://wa.me/${toWhatsAppNumber(lead.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
                  >
                    {lead.email}
                  </a>
                )}
                <div className="ml-auto">
                  <ArchiveButton id={lead.id} archived={lead.archived} />
                </div>
              </div>

              <LeadEditor lead={lead} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}