import { getSimilarProperties } from "../services/property.service";
import type { Property } from "../types";
import { PropertyCard } from "./property-card";

export async function SimilarProperties({ property }: { property: Property }) {
  const similar = await getSimilarProperties({
    id: property.id,
    purpose: property.purpose,
    type: property.type,
    city: property.city,
    area: property.area,
    price: property.price,
  });


  if (similar.length === 0) return null;

  return (
    <section className="mt-16 border-t border-foreground/10 pt-10">
      <h2 className="text-2xl font-bold">You may also like</h2>
      <p className="mb-6 mt-1 text-foreground/60">
        Similar properties in {property.city}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {similar.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </section>
  );
}