import { Suspense } from "react";
import type { Metadata } from "next";

import { PropertyResults } from "@/features/properties/components/property-results";
import { PropertySearchForm } from "@/features/properties/components/property-search-form";

export const metadata: Metadata = {
  title: "Properties for sale and rent",
  description: "Browse houses, apartments, plots and commercial properties.",
};

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Properties</h1>
      <p className="mb-8 mt-1 text-foreground/60">
        Find the right place to buy or rent.
      </p>

      <div className="mb-10">
        <PropertySearchForm />
      </div>

      <Suspense
        fallback={<p className="py-16 text-center text-foreground/60">Loading...</p>}
      >
        <PropertyResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}