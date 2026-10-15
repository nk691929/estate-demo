export type PropertyPurpose = "sale" | "rent";

export type PropertyType = "house" | "apartment" | "plot" | "commercial";

export type AreaUnit = "marla" | "kanal" | "sqft";

export interface Property {
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
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  sizeUnit: AreaUnit;
  images: string[];
  features: string[];
  featured: boolean;
  agentId: string;
  latitude: number;
  longitude: number;
}