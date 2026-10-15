import { PropertyCard } from "@/features/properties/components/property-card";
import { getProperties } from "@/features/properties/services/property.service";

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
}