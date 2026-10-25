import Link from "next/link";

import { hasActiveFilters, propertiesHref } from "../search-params";
import {
  searchProperties,
  type PropertyQuery,
  type PropertySort,
} from "../services/property.service";
import { PropertyCard } from "./property-card";
import { PropertyPagination } from "./property-pagination";

const sortOptions: { value: PropertySort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export async function PropertyResults({ query }: { query: PropertyQuery }) {
  const result = await searchProperties(query);
  const current: PropertyQuery = { ...query, page: result.page };
  const activeSort = query.sort ?? "newest";

  if (result.total === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 py-16 text-center">
        <p className="text-lg font-semibold">
          {hasActiveFilters(query)
            ? "No properties match your search"
            : "No properties are listed yet"}
        </p>
        {hasActiveFilters(query) && (
          <>
            <p className="mt-1 text-sm text-foreground/60">
              Try changing or clearing your filters.
            </p>
            <Link
              href="/properties"
              className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
            >
              Clear filters
            </Link>
          </>
        )}
      </div>
    );
  }

  const from = (result.page - 1) * result.pageSize + 1;
  const to = from + result.items.length - 1;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground/60">
          Showing {from}
          {to > from ? `-${to}` : ""} of {result.total}{" "}
          {result.total === 1 ? "property" : "properties"}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-foreground/50">Sort by</span>
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={propertiesHref(query, { sort: option.value, page: 1 })}
              aria-current={activeSort === option.value ? "true" : undefined}
              className={`rounded-full border px-3 py-1.5 transition ${
                activeSort === option.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {activeSort !== "newest" && !query.purpose && (
        <p className="mb-4 text-xs text-foreground/50">
          Sale and rent prices are on different scales, so a mixed list sorted
          by price can look odd. Choose Buy or Rent above to compare fairly.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {result.items.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <PropertyPagination
        query={current}
        page={result.page}
        totalPages={result.totalPages}
      />
    </>
  );
}