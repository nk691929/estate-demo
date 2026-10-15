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
      className="group block overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
          For {property.purpose}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-xl font-bold">
          {formatPrice(property.price, property.purpose)}
        </p>
        <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {property.area}, {property.city}
        </p>

        <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
          {property.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="size-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="size-4" />
              {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="size-4" />
            {formatSize(property.size, property.sizeUnit)}
          </span>
        </div>
      </div>
    </Link>
  );
}