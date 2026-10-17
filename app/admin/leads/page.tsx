import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";

import { requireAdmin } from "@/features/auth/require-admin";
import { getLeads } from "@/features/leads/services/lead.service";
import type { LeadStatus } from "@/features/leads/types";

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

export default async function LeadsPage() {
  const { supabase } = await requireAdmin();
  const leads = await getLeads(supabase);
  const newCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Leads</h1>
      <p className="mb-8 mt-1 text-foreground/60">
        {leads.length} total, {newCount} new
      </p>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-foreground/10 py-16 text-center text-foreground/60">
          No leads yet. They appear here when someone sends an inquiry.
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
                    {lead.source === "property" ? "Property inquiry" : "Contact form"}
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

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}