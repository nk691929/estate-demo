import { Suspense } from "react";
import type { Metadata } from "next";

import { PropertyListing } from "@/features/properties/components/property-listing";
import type { RawSearchParams } from "@/features/properties/search-params";

export const metadata: Metadata = {
  title: "Properties for sale and rent",
  description: "Browse houses, apartments, plots and commercial properties.",
  alternates: { canonical: "/properties" },
};

function ListingSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mb-8 h-32 animate-pulse rounded-2xl bg-foreground/10" />
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="aspect-[4/5] animate-pulse rounded-2xl bg-foreground/10"
          />
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Properties</h1>
      <p className="mb-8 mt-1 text-foreground/60">
        Find the right place to buy or rent.
      </p>

      <Suspense fallback={<ListingSkeleton />}>
        <PropertyListing searchParams={searchParams} />
      </Suspense>
    </main>
  );
}