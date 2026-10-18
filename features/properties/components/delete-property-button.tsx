"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteProperty } from "../actions";

export function DeletePropertyButton({
  propertyId,
  title,
}: {
  propertyId: string;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);

    const result = await deleteProperty(propertyId);

    if (result.ok) {
      router.replace("/admin/properties");
      return;
    }

    setError(result.error);
    setBusy(false);
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
      >
        <Trash2 className="size-4" />
        Delete property
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
      <p className="font-semibold">Delete &ldquo;{title}&rdquo;?</p>
      <p className="text-sm text-foreground/70">
        This permanently removes the listing and its photos. Leads about it are
        kept. To hide it for now instead, use Unpublish.
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {busy ? "Deleting..." : "Yes, delete it"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="rounded-lg border border-foreground/20 px-4 py-2.5 text-sm transition hover:bg-foreground/5 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}