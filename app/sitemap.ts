import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getAllPropertySlugs } from "@/features/properties/services/property.service";

const staticPages = ["", "/properties", "/agents", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPropertySlugs();

  const pages = staticPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
  }));

  const properties = slugs.map((slug) => ({
    url: `${siteConfig.url}/properties/${slug}`,
  }));

  return [...pages, ...properties];
}