import type { PropertyQuery, PropertySort } from "./services/property.service";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const purposes = ["sale", "rent"] as const;
const types = ["house", "apartment", "plot", "commercial"] as const;
const sorts: PropertySort[] = ["newest", "price_asc", "price_desc"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toInt(
  value: string | undefined,
  min: number,
  max: number
): number | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/,/g, "").trim();
  if (!/^\d+$/.test(cleaned)) return undefined;
  const number = Number(cleaned);
  return number >= min && number <= max ? number : undefined;
}

export function parsePropertyQuery(params: RawSearchParams): PropertyQuery {
  const city = first(params.city)?.trim().slice(0, 60);

  let minPrice = toInt(first(params.minPrice), 0, 1_000_000_000_000);
  let maxPrice = toInt(first(params.maxPrice), 0, 1_000_000_000_000);

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    purpose: purposes.find((item) => item === first(params.purpose)),
    type: types.find((item) => item === first(params.type)),
    city: city || undefined,
    minPrice,
    maxPrice,
    bedrooms: toInt(first(params.bedrooms), 1, 10),
    sort: sorts.find((item) => item === first(params.sort)),
    page: toInt(first(params.page), 1, 10_000),
  };
}

export function hasActiveFilters(query: PropertyQuery) {
  return (
    query.purpose !== undefined ||
    query.type !== undefined ||
    query.city !== undefined ||
    query.minPrice !== undefined ||
    query.maxPrice !== undefined ||
    query.bedrooms !== undefined
  );
}

export function propertiesHref(
  query: PropertyQuery,
  overrides: Partial<PropertyQuery> = {}
) {
  const merged = { ...query, ...overrides };
  const search = new URLSearchParams();

  const entries: [string, string | number | undefined][] = [
    ["purpose", merged.purpose],
    ["type", merged.type],
    ["city", merged.city],
    ["minPrice", merged.minPrice],
    ["maxPrice", merged.maxPrice],
    ["bedrooms", merged.bedrooms],
    ["sort", merged.sort && merged.sort !== "newest" ? merged.sort : undefined],
    ["page", merged.page && merged.page > 1 ? merged.page : undefined],
  ];

  for (const [key, value] of entries) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }

  const text = search.toString();
  return text ? `/properties?${text}` : "/properties";
}