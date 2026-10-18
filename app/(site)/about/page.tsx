import type { Metadata } from "next";
import Image from "next/image";
import { Handshake, ShieldCheck, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About us",
  description: `Learn about ${siteConfig.name}, a trusted real estate agency.`,
};

const stats = [
  { value: "12+", label: "Years of experience" },
  { value: "850+", label: "Properties sold" },
  { value: "1,200+", label: "Happy clients" },
  { value: "15", label: "Areas covered" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    text: "Every listing is verified, and every price is clear before you visit.",
  },
  {
    icon: Handshake,
    title: "Honest advice",
    text: "We tell you what a property is really worth, even when it costs us a sale.",
  },
  {
    icon: Sparkles,
    title: "Smooth process",
    text: "From the first viewing to the final paperwork, we handle the details.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold">About {siteConfig.name}</h1>
          <p className="mt-4 leading-relaxed text-foreground/70">
            {siteConfig.name} started with a simple idea: buying or renting a
            home should feel clear and fair. We combine local knowledge with
            honest advice, so you can decide with confidence.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/70">
            Whether you are a first-time buyer, an investor, or looking for a
            rental, our team stays with you at every step.
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src="/images/properties/about.jpg"
            alt="Our office"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-foreground/5 py-12">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm text-foreground/60">{stat.label}</dt>
              <dd className="mt-1 text-4xl font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">What we stand for</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-foreground/10 p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}