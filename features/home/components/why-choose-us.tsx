import {
  BadgeCheck,
  Handshake,
  MapPinned,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { whyChooseUs, type IconKey } from "@/config/home-content";

const icons: Record<IconKey, LucideIcon> = {
  verified: BadgeCheck,
  local: MapPinned,
  chat: MessageCircle,
  support: Handshake,
};

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        title="Why choose us"
        subtitle="What you can expect when you work with us"
        centered
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {whyChooseUs.map((item) => {
          const Icon = icons[item.icon];

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-foreground/10 p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}