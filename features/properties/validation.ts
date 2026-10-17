import type {
  AreaUnit,
  Property,
  PropertyPurpose,
  PropertyType,
} from "./types";

export type PropertyFormValues = {
  title: string;
  description: string;
  price: string;
  purpose: string;
  type: string;
  city: string;
  area: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  sizeUnit: string;
  features: string;
  featured: boolean;
  latitude: string;
  longitude: string;
};

export type PropertyUpdate = {
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
  features: string[];
  featured: boolean;
  latitude: number;
  longitude: number;
};

type ParseResult =
  | { ok: true; data: PropertyUpdate }
  | { ok: false; error: string };

const purposes: PropertyPurpose[] = ["sale", "rent"];
const types: PropertyType[] = ["house", "apartment", "plot", "commercial"];
const units: AreaUnit[] = ["marla", "kanal", "sqft"];

const fail = (error: string): ParseResult => ({ ok: false, error });

function toNumber(value: string): number | null {
  const text = value.replace(/,/g, "").trim();
  if (text === "") return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function toOptionalCount(value: string): number | null | "invalid" {
  if (value.trim() === "") return null;
  const number = toNumber(value);
  if (number === null || !Number.isInteger(number) || number < 0 || number > 50)
    return "invalid";
  return number;
}

export function parsePropertyForm(values: PropertyFormValues): ParseResult {
  const title = values.title.trim();
  const description = values.description.trim();
  const city = values.city.trim();
  const area = values.area.trim();
  const address = values.address.trim();

  if (title.length < 5 || title.length > 150)
    return fail("Title must be 5 to 150 characters.");
  if (description.length < 20 || description.length > 3000)
    return fail("Description must be 20 to 3000 characters.");
  if (!city || !area || !address)
    return fail("City, area and address are required.");

  const price = toNumber(values.price);
  if (price === null || !Number.isInteger(price) || price <= 0)
    return fail("Enter the price as a whole number of rupees.");

  const purpose = purposes.find((item) => item === values.purpose);
  const type = types.find((item) => item === values.type);
  const sizeUnit = units.find((item) => item === values.sizeUnit);
  if (!purpose || !type || !sizeUnit)
    return fail("Choose a purpose, type and size unit.");

  const size = toNumber(values.size);
  if (size === null || size <= 0) return fail("Enter a valid size.");

  const bedrooms = toOptionalCount(values.bedrooms);
  const bathrooms = toOptionalCount(values.bathrooms);
  if (bedrooms === "invalid" || bathrooms === "invalid")
    return fail("Bedrooms and bathrooms must be whole numbers, or left empty.");

  const latitude = toNumber(values.latitude);
  const longitude = toNumber(values.longitude);
  if (
    latitude === null ||
    longitude === null ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  )
    return fail("Enter valid map coordinates.");

  const features = values.features
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (features.length > 20 || features.some((item) => item.length > 40))
    return fail("Use at most 20 features, each under 40 characters.");

  return {
    ok: true,
    data: {
      title,
      description,
      price,
      purpose,
      type,
      city,
      area,
      address,
      bedrooms,
      bathrooms,
      size,
      size_unit: sizeUnit,
      features,
      featured: values.featured,
      latitude,
      longitude,
    },
  };
}

export function toFormValues(property: Property): PropertyFormValues {
  return {
    title: property.title,
    description: property.description,
    price: String(property.price),
    purpose: property.purpose,
    type: property.type,
    city: property.city,
    area: property.area,
    address: property.address,
    bedrooms: property.bedrooms === undefined ? "" : String(property.bedrooms),
    bathrooms:
      property.bathrooms === undefined ? "" : String(property.bathrooms),
    size: String(property.size),
    sizeUnit: property.sizeUnit,
    features: property.features.join(", "),
    featured: property.featured,
    latitude: String(property.latitude),
    longitude: String(property.longitude),
  };
}