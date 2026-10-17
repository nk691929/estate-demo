"use client";

import { useState } from "react";

import { updateLead } from "../actions";
import type { Lead, LeadStatus } from "../types";

const statuses: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "viewing", label: "Viewing scheduled" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function LeadEditor({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const changed = status !== lead.status || notes !== lead.notes;

  async function handleSave() {
    setState("saving");
    setError(null);

    const result = await updateLead({ id: lead.id, status, notes });

    if (result.ok) {
      setState("saved");
    } else {
      setState("error");
      setError(result.error);
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-foreground/10 pt-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as LeadStatus);
            setState("idle");
          }}
          className="h-10 rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSave}
          disabled={!changed || state === "saving"}
          className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-80 disabled:opacity-40"
        >
          {state === "saving" ? "Saving..." : "Save"}
        </button>

        {state === "saved" && !changed && (
          <span className="text-sm text-green-500">Saved</span>
        )}
        {state === "error" && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setState("idle");
        }}
        rows={2}
        maxLength={2000}
        placeholder="Add a note (call outcome, budget, viewing time...)"
        className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}