import type { PropertySummary } from "@/features/properties/services/property.service";

export function StatsStrip({ summary }: { summary: PropertySummary }) {
  const items = [
    { label: "Properties listed", value: summary.total },
    { label: "For sale", value: summary.forSale },
    { label: "For rent", value: summary.forRent },
    { label: "Areas covered", value: summary.areas },
  ];

  return (
    <section className="bg-foreground/5 py-12">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dd className="text-4xl font-bold">{item.value}</dd>
            <dt className="mt-1 text-sm text-foreground/60">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}