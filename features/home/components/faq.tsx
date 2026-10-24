import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { faqs } from "@/config/home-content";

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <SectionHeading
        title="Frequently asked questions"
        subtitle="Quick answers before you get in touch"
        centered
      />

      <div className="space-y-3">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-foreground/10 p-5 open:bg-foreground/5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown className="size-5 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}