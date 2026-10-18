import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/features/auth/require-admin";
import { createProperty } from "@/features/properties/actions";
import { PropertyForm } from "@/features/properties/components/property-form";
import type { PropertyFormValues } from "@/features/properties/validation";

const blank: PropertyFormValues = {
  title: "",
  description: "",
  price: "",
  purpose: "sale",
  type: "house",
  city: "Lahore",
  area: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  size: "",
  sizeUnit: "marla",
  features: "",
  featured: false,
  latitude: "31.5204",
  longitude: "74.3587",
};

export default async function NewPropertyPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All properties
      </Link>

      <h1 className="text-3xl font-bold">Add property</h1>
      <p className="mb-8 mt-1 text-foreground/60">
        Fill in the details. You add photos and publish on the next screen.
      </p>

      <PropertyForm
        initial={blank}
        action={createProperty}
        submitLabel="Create draft"
      />
    </main>
  );
}