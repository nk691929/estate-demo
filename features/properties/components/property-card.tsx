import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";

import { formatPrice, formatSize } from "@/lib/format";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
          For {property.purpose}
        </span>
      </div>

      <div className="space-y-1.5 p-3 sm:space-y-3 sm:p-4">
        <p className="text-sm font-bold leading-tight sm:text-xl">
          {formatPrice(property.price, property.purpose)}
        </p>
        <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-foreground/60 sm:text-sm">
          <MapPin className="size-3.5 shrink-0 sm:size-4" />
          <span className="truncate">
            {property.area}, {property.city}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-foreground/10 pt-2 text-xs text-foreground/60 sm:gap-x-4 sm:pt-3 sm:text-sm">
          {property.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="size-3.5 sm:size-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="size-3.5 sm:size-4" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="size-3.5 sm:size-4" />
            {formatSize(property.size, property.sizeUnit)}
          </span>
        </div>
      </div>
    </Link>
  );
}