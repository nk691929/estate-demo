"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold">Oops</p>
      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-foreground/60">
        This page could not be loaded. Please try again, or reach us directly.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          Try again
        </button>
        <Link
          href="/properties"
          className="rounded-lg border border-foreground/20 px-5 py-3 text-sm transition hover:bg-foreground/5"
        >
          Browse properties
        </Link>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 rounded-lg border border-foreground/20 px-5 py-3 text-sm transition hover:bg-foreground/5"
        >
          <Phone className="size-4" />
          Call us
        </a>
      </div>
    </main>
  );
}