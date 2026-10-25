import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";

import { hasActiveFilters, propertiesHref } from "../search-params";
import type { PropertyQuery } from "../services/property.service";

const fieldClass =
  "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground";

export function PropertyFilterBar({ query }: { query: PropertyQuery }) {
  const moreOpen =
    query.minPrice !== undefined ||
    query.maxPrice !== undefined ||
    query.bedrooms !== undefined;

  return (
    <Form
      key={propertiesHref({ ...query, page: undefined })}
      action="/properties"
      className="rounded-2xl border border-foreground/10 p-4"
    >
      {query.sort && query.sort !== "newest" && (
        <input type="hidden" name="sort" value={query.sort} />
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <select
          name="purpose"
          defaultValue={query.purpose ?? ""}
          aria-label="Buy or rent"
          className={fieldClass}
        >
          <option value="">Buy or rent</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <select
          name="type"
          defaultValue={query.type ?? ""}
          aria-label="Property type"
          className={fieldClass}
        >
          <option value="">Any type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <input
          name="city"
          defaultValue={query.city ?? ""}
          placeholder="City, e.g. Lahore"
          aria-label="City"
          className={fieldClass}
        />

        <button
          type="submit"
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground font-medium text-background transition hover:opacity-80"
        >
          <Search className="size-4" />
          Search
        </button>
      </div>

      <details open={moreOpen} className="mt-3">
        <summary className="cursor-pointer text-sm text-foreground/70 hover:text-foreground">
          More filters: price and bedrooms
        </summary>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            name="minPrice"
            defaultValue={query.minPrice ?? ""}
            inputMode="numeric"
            placeholder="Min price (PKR)"
            aria-label="Minimum price in rupees"
            className={fieldClass}
          />
          <input
            name="maxPrice"
            defaultValue={query.maxPrice ?? ""}
            inputMode="numeric"
            placeholder="Max price (PKR)"
            aria-label="Maximum price in rupees"
            className={fieldClass}
          />
          <select
            name="bedrooms"
            defaultValue={query.bedrooms ? String(query.bedrooms) : ""}
            aria-label="Minimum bedrooms"
            className={fieldClass}
          >
            <option value="">Any bedrooms</option>
            <option value="1">1+ bedrooms</option>
            <option value="2">2+ bedrooms</option>
            <option value="3">3+ bedrooms</option>
            <option value="4">4+ bedrooms</option>
            <option value="5">5+ bedrooms</option>
          </select>
        </div>

        {!query.purpose && (
          <p className="mt-2 text-xs text-foreground/50">
            Sale and rent prices are on different scales. Choose Buy or Rent
            first if you set a price range.
          </p>
        )}
      </details>

      {hasActiveFilters(query) && (
        <div className="mt-3 text-sm">
          <Link
            href="/properties"
            className="text-foreground/70 underline-offset-4 hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </Form>
  );
}