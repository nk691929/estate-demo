"use server";

import { revalidatePath } from "next/cache";

import { createAuthClient } from "@/lib/supabase/server";
import type { LeadStatus } from "./types";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "viewing",
  "negotiating",
  "won",
  "lost",
];

export async function updateLead(input: {
  id: string;
  status: LeadStatus;
  notes: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!STATUSES.includes(input.status)) {
    return { ok: false, error: "Invalid status." };
  }

  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      status: input.status,
      notes: input.notes.trim().slice(0, 2000),
    })
    .eq("id", input.id)
    .select("id");

  if (error || !data || data.length === 0) {
    return { ok: false, error: "Could not save changes." };
  }

  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function setLeadArchived(
  id: string,
  archived: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getClaims();

  if (!auth?.claims) {
    return { ok: false, error: "Please sign in again." };
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ archived })
    .eq("id", id)
    .select("id");

  if (error || !data || data.length === 0) {
    return { ok: false, error: "Could not update the lead." };
  }

  revalidatePath("/admin/leads");
  return { ok: true };
}