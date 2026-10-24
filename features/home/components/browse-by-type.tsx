import Image from "next/image";
import Link from "next/link";
import { Building2, Home, LandPlot, Store } from "lucide-react";

import type { PropertySummary } from "@/features/properties/services/property.service";

const types = [
  { type: "house", label: "Houses", icon: Home },
  { type: "apartment", label: "Apartments", icon: Building2 },
  { type: "plot", label: "Plots", icon: LandPlot },
  { type: "commercial", label: "Commercial", icon: Store },
] as const;

export function BrowseByType({ summary }: { summary: PropertySummary }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Browse by property type</h2>
        <p className="mt-1 text-foreground/60">
          Start with what you are looking for
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {types.map(({ type, label, icon: Icon }) => {
          const entry = summary.byType[type];

          return (
            <Link
              key={type}
              href={`/properties?type=${type}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-foreground/10"
            >
              {entry.cover ? (
                <Image
                  src={entry.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <Icon className="absolute left-1/2 top-1/3 size-12 -translate-x-1/2 text-foreground/30" />
              )}

              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.15) 55%, transparent)",
                }}
              />

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Icon className="mb-2 size-5" />
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-sm text-white/75">
                  {entry.count} {entry.count === 1 ? "listing" : "listings"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}