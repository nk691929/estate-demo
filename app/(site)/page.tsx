import Link from "next/link";

import { BrowseByType } from "@/features/home/components/browse-by-type";
import { HeroSection } from "@/features/home/components/hero-section";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { StatsStrip } from "@/features/home/components/stats-strip";
import { PropertyCard } from "@/features/properties/components/property-card";
import {
  getFeaturedProperties,
  getPropertySummary,
} from "@/features/properties/services/property.service";

export default async function Home() {
  const [featured, summary] = await Promise.all([
    getFeaturedProperties(),
    getPropertySummary(),
  ]);

  return (
    <main>
      <HeroSection />

      <BrowseByType summary={summary} />

      <section className="mx-auto max-w-6xl px-4 pb-16">
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

      <StatsStrip summary={summary} />

      <HowItWorks />
    </main>
  );
}