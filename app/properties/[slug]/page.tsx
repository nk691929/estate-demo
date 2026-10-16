import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Bath, Bed, MapPin, Phone, Ruler } from "lucide-react";

import { siteConfig } from "@/config/site";
import { formatPrice, formatSize } from "@/lib/format";
import {
  getAllPropertySlugs,
  getPropertyBySlug,
} from "@/features/properties/services/property.service";
import { InquiryForm } from "@/features/inquiries/components/inquiry-form";


type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) return { title: "Property not found" };

  return {
    title: property.title,
    description: property.description.slice(0, 155),
    openGraph: { images: [property.images[0]] },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const [mainImage, ...otherImages] = property.images;
  const whatsappText = encodeURIComponent(
    `Hello, I am interested in: ${property.title}`
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to properties
      </Link>

      <div className="grid gap-3 md:h-[420px] md:grid-cols-3">
        <div className="relative h-64 overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:h-auto">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            priority
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
        {otherImages.slice(0, 2).map((image, index) => (
          <div
            key={image}
            className="relative hidden overflow-hidden rounded-2xl md:block"
          >
            <Image
              src={image}
              alt={`${property.title} photo ${index + 2}`}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase text-background">
              For {property.purpose}
            </span>
            <h1 className="mt-3 text-3xl font-bold">{property.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-foreground/60">
              <MapPin className="size-4" />
              {property.address}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 rounded-2xl border border-foreground/10 p-5">
            {property.bedrooms !== undefined && (
              <span className="flex items-center gap-2">
                <Bed className="size-5" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms !== undefined && (
              <span className="flex items-center gap-2">
                <Bath className="size-5" />
                {property.bathrooms} Baths
              </span>
            )}
            <span className="flex items-center gap-2">
              <Ruler className="size-5" />
              {formatSize(property.size, property.sizeUnit)}
            </span>
          </div>

          <section>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="leading-relaxed text-foreground/70">
              {property.description}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Features</h2>
            <ul className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-foreground/10 p-6 lg:sticky lg:top-24">
          <p className="text-3xl font-bold">
            {formatPrice(property.price, property.purpose)}
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-green-600 py-3 text-center font-medium text-white transition hover:bg-green-700"
          >
            Chat on WhatsApp
          </a>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-foreground/20 py-3 font-medium transition hover:bg-foreground/5"
          >
            <Phone className="size-4" />
            Call {siteConfig.phone}
          </a>

          <div className="border-t border-foreground/10 pt-4">
            <InquiryForm propertyTitle={property.title} />
          </div>
        </aside>
      </div>
    </main>
  );
}