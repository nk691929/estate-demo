import { cacheLife, cacheTag } from "next/cache";

import { getSupabase } from "@/lib/supabase/client";
import type {
  AreaUnit,
  Property,
  PropertyPurpose,
  PropertyType,
} from "../types";

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

export type PropertyRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  purpose: PropertyPurpose;
  type: PropertyType;
  city: string;
  area: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number;
  size_unit: AreaUnit;
  images: string[];
  features: string[];
  featured: boolean;
  agent_id: string | null;
  latitude: number;
  longitude: number;
};

export function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: row.price,
    purpose: row.purpose,
    type: row.type,
    city: row.city,
    area: row.area,
    address: row.address,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    size: row.size,
    sizeUnit: row.size_unit,
    images: row.images,
    features: row.features,
    featured: row.featured,
    agentId: row.agent_id ?? "",
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<Property[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");

  let query = getSupabase()
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id");

  if (filters.purpose) query = query.eq("purpose", filters.purpose);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.city) {
    const safeCity = filters.city.replace(/[\\%_]/g, "\\$&");
    query = query.ilike("city", safeCity);
  }
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms !== undefined)
    query = query.gte("bedrooms", filters.bedrooms);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load properties: ${error.message}`);

  return (data as PropertyRow[]).map(toProperty);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");

  const { data, error } = await getSupabase()
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .order("id");

  if (error) throw new Error(`Could not load featured properties: ${error.message}`);

  return (data as PropertyRow[]).map(toProperty);
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties", `property-${slug}`);

  const { data, error } = await getSupabase()
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Could not load property: ${error.message}`);

  return data ? toProperty(data as PropertyRow) : undefined;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");

  const { data, error } = await getSupabase().from("properties").select("slug");

  if (error) throw new Error(`Could not load slugs: ${error.message}`);

  return (data as { slug: string }[]).map((row) => row.slug);
}

export type PropertySummary = {
  total: number;
  forSale: number;
  forRent: number;
  areas: number;
  byType: Record<PropertyType, { count: number; cover?: string }>;
};

export async function getPropertySummary(): Promise<PropertySummary> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");

  const { data, error } = await getSupabase()
    .from("properties")
    .select("purpose, type, area, images")
    .order("created_at", { ascending: false })
    .order("id");

  if (error) throw new Error(`Could not summarise properties: ${error.message}`);

  const summary: PropertySummary = {
    total: 0,
    forSale: 0,
    forRent: 0,
    areas: 0,
    byType: {
      house: { count: 0 },
      apartment: { count: 0 },
      plot: { count: 0 },
      commercial: { count: 0 },
    },
  };

  const areas = new Set<string>();

  for (const row of data as {
    purpose: PropertyPurpose;
    type: PropertyType;
    area: string;
    images: string[];
  }[]) {
    summary.total += 1;
    if (row.purpose === "sale") summary.forSale += 1;
    else summary.forRent += 1;

    areas.add(row.area.trim().toLowerCase());

    const entry = summary.byType[row.type];
    entry.count += 1;
    if (!entry.cover && row.images[0]) entry.cover = row.images[0];
  }

  summary.areas = areas.size;

  return summary;
}

export type PropertySort = "newest" | "price_asc" | "price_desc";

export type PropertyQuery = PropertyFilters & {
  sort?: PropertySort;
  page?: number;
};

export type PropertyPage = {
  items: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const PROPERTY_PAGE_SIZE = 12;

function buildPropertyQuery(query: PropertyQuery) {
  let request = getSupabase()
    .from("properties")
    .select("*", { count: "exact" });

  if (query.purpose) request = request.eq("purpose", query.purpose);
  if (query.type) request = request.eq("type", query.type);
  if (query.city) {
    const safeCity = query.city.replace(/[\\%_]/g, "\\$&");
    request = request.ilike("city", safeCity);
  }
  if (query.minPrice !== undefined) request = request.gte("price", query.minPrice);
  if (query.maxPrice !== undefined) request = request.lte("price", query.maxPrice);
  if (query.bedrooms !== undefined)
    request = request.gte("bedrooms", query.bedrooms);

  switch (query.sort) {
    case "price_asc":
      return request.order("price", { ascending: true }).order("id");
    case "price_desc":
      return request.order("price", { ascending: false }).order("id");
    default:
      return request
        .order("created_at", { ascending: false })
        .order("id");
  }
}

async function fetchPropertyPage(query: PropertyQuery, page: number) {
  const from = (page - 1) * PROPERTY_PAGE_SIZE;
  return await buildPropertyQuery(query).range(
    from,
    from + PROPERTY_PAGE_SIZE - 1
  );
}

export async function searchProperties(
  query: PropertyQuery = {}
): Promise<PropertyPage> {
  "use cache";
  cacheLife("minutes");
  cacheTag("properties");

  let page = Math.max(1, Math.floor(query.page ?? 1));
  let result = await fetchPropertyPage(query, page);

  // Someone asked for a page past the end (an old link, or a typed address).
  const outOfRange =
    page > 1 &&
    (result.error?.code === "PGRST103" || (result.data?.length ?? 0) === 0);

  if (outOfRange) {
    const first = await fetchPropertyPage(query, 1);
    if (first.error) {
      throw new Error(`Could not load properties: ${first.error.message}`);
    }
    page = Math.max(1, Math.ceil((first.count ?? 0) / PROPERTY_PAGE_SIZE));
    result = page === 1 ? first : await fetchPropertyPage(query, page);
  }

  if (result.error) {
    throw new Error(`Could not load properties: ${result.error.message}`);
  }

  const total = result.count ?? 0;

  return {
    items: (result.data as PropertyRow[]).map(toProperty),
    total,
    page,
    pageSize: PROPERTY_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PROPERTY_PAGE_SIZE)),
  };
}