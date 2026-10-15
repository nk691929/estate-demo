import { mockProperties } from "../data/mock-properties";
import type { Property, PropertyPurpose, PropertyType } from "../types";

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<Property[]> {
  return mockProperties.filter((property) => {
    if (filters.purpose && property.purpose !== filters.purpose) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (
      filters.city &&
      property.city.toLowerCase() !== filters.city.toLowerCase()
    )
      return false;
    if (filters.minPrice !== undefined && property.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice)
      return false;
    if (
      filters.bedrooms !== undefined &&
      (property.bedrooms ?? 0) < filters.bedrooms
    )
      return false;
    return true;
  });
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return mockProperties.filter((property) => property.featured);
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  return mockProperties.find((property) => property.slug === slug);
}

export async function getAllPropertySlugs(): Promise<string[]> {
  return mockProperties.map((property) => property.slug);
}