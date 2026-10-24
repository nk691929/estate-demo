"use client";

import { useState } from "react";
import { Archive, ArchiveRestore } from "lucide-react";

import { setLeadArchived } from "../actions";

export function ArchiveButton({
  id,
  archived,
}: {
  id: string;
  archived: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setError(null);

    const result = await setLeadArchived(id, !archived);

    if (!result.ok) setError(result.error);
    setBusy(false);
  }

  const Icon = archived ? ArchiveRestore : Archive;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="flex items-center gap-2 rounded-lg border border-foreground/20 px-3 py-2 text-sm transition hover:bg-foreground/5 disabled:opacity-50"
      >
        <Icon className="size-4" />
        {busy ? "Working..." : archived ? "Restore" : "Archive"}
      </button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}