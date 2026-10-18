import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { requireAdmin } from "@/features/auth/require-admin";
import { getPropertiesForAdmin } from "@/features/properties/services/property-admin.service";
import { formatPrice } from "@/lib/format";

export default async function AdminPropertiesPage() {
  const { supabase } = await requireAdmin();
  const properties = await getPropertiesForAdmin(supabase);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="mt-1 text-foreground/60">{properties.length} listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          <Plus className="size-4" />
          Add property
        </Link>
      </div>

      <ul className="space-y-3">
        {properties.map((property) => (
          <li
            key={property.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/10 p-4"
          >
            <div>
              <p className="font-semibold">
                {property.title}{" "}
                <span
                  className={`ml-1 rounded-full px-2.5 py-0.5 align-middle text-xs font-semibold ${
                    property.published
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {property.published ? "Published" : "Draft"}
                </span>
              </p>
              <p className="text-sm text-foreground/60">
                {formatPrice(property.price, property.purpose)} ·{" "}
                {property.area}, {property.city}
                {property.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              {property.published && (
                <Link
                  href={`/properties/${property.slug}`}
                  target="_blank"
                  className="rounded-lg border border-foreground/20 px-3 py-2 transition hover:bg-foreground/5"
                >
                  View
                </Link>
              )}
              <Link
                href={`/admin/properties/${property.id}/edit`}
                className="rounded-lg bg-foreground px-3 py-2 text-background transition hover:opacity-80"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}