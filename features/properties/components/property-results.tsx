import Link from "next/link";

import {
  getProperties,
  type PropertyFilters,
} from "../services/property.service";
import { PropertyCard } from "./property-card";

type SearchParams = Record<string, string | string[] | undefined>;

const purposes = ["sale", "rent"] as const;
const types = ["house", "apartment", "plot", "commercial"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(params: SearchParams): PropertyFilters {
  const purpose = first(params.purpose);
  const type = first(params.type);
  const city = first(params.city)?.trim();

  return {
    purpose: purposes.find((p) => p === purpose),
    type: types.find((t) => t === type),
    city: city || undefined,
  };
}

export async function PropertyResults({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);
  const properties = await getProperties(filters);

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 py-16 text-center">
        <p className="text-lg font-semibold">No properties match your search</p>
        <p className="mt-1 text-sm text-foreground/60">
          Try changing or clearing your filters.
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-foreground/60">
        {properties.length} {properties.length === 1 ? "property" : "properties"} found
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  );
}