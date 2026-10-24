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