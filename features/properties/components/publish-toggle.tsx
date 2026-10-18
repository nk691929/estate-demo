"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { setPublished } from "../actions";

export function PublishToggle({
  propertyId,
  published,
}: {
  propertyId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);

    const result = await setPublished(propertyId, !published);

    if (result.ok) {
      router.refresh();
    } else {
      setError(result.error);
    }

    setBusy(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-foreground/10 p-5">
      <div className="flex-1">
        <p className="font-semibold">
          {published ? "Published" : "Draft (hidden from visitors)"}
        </p>
        <p className="text-sm text-foreground/60">
          {published
            ? "Visitors can see this listing on the website."
            : "Add photos, then publish to show it on the website."}
        </p>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="h-11 rounded-lg bg-foreground px-6 text-sm font-medium text-background transition hover:opacity-80 disabled:opacity-50"
      >
        {busy ? "Working..." : published ? "Unpublish" : "Publish"}
      </button>
    </div>
  );
}