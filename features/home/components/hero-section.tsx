import Image from "next/image";

import { siteConfig } from "@/config/site";
import { PropertySearchForm } from "@/features/properties/components/property-search-form";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{siteConfig.tagline}</h1>
        <p className="mt-4 text-lg text-white/80">{siteConfig.description}</p>
        <div className="mt-8">
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
}