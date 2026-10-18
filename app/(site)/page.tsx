import Link from "next/link";

import { HeroSection } from "@/features/home/components/hero-section";
import { PropertyCard } from "@/features/properties/components/property-card";
import { getFeaturedProperties } from "@/features/properties/services/property.service";

export default async function Home() {
  const featured = await getFeaturedProperties();

  return (
    <main>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured properties</h2>
            <p className="mt-1 text-foreground/60">
              Hand-picked homes, plots and rentals
            </p>
          </div>
          <Link
            href="/properties"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}