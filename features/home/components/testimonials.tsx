import { Quote } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials, testimonialsAreSamples } from "@/config/home-content";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        title="What our clients say"
        subtitle="Words from people we have helped"
        centered
      />

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col rounded-2xl border border-foreground/10 p-6"
          >
            <Quote className="size-7 text-foreground/25" />
            <blockquote className="mt-3 flex-1 text-foreground/80">
              {item.text}
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold">{item.name}</span>
              <span className="block text-foreground/50">{item.place}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {testimonialsAreSamples && (
        <p className="mt-6 text-center text-xs text-foreground/50">
          Sample reviews for demonstration. Replace with real client feedback
          before launch.
        </p>
      )}
    </section>
  );
}