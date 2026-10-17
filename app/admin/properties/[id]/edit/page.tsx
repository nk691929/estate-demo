import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/features/auth/require-admin";
import { updateProperty } from "@/features/properties/actions";
import { PropertyForm } from "@/features/properties/components/property-form";
import { getPropertyForEdit } from "@/features/properties/services/property-admin.service";
import { toFormValues } from "@/features/properties/validation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const property = await getPropertyForEdit(supabase, id);
  if (!property) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All properties
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Edit property</h1>

      <PropertyForm
        initial={toFormValues(property)}
        action={updateProperty.bind(null, property.id)}
        submitLabel="Save changes"
      />
    </main>
  );
}