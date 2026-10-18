import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/inquiries/components/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get in touch with ${siteConfig.name} to buy, sell or rent a property.`,
};

const details = [
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${siteConfig.whatsapp}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    label: "Office",
    value: siteConfig.address,
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="mb-10 mt-1 text-foreground/60">
        Questions about a property? We usually reply within a few hours.
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        <ul className="space-y-4">
          {details.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-foreground/60">
                    {label}
                  </span>
                  <span className="font-medium">{value}</span>
                </span>
              </>
            );

            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    className="flex items-center gap-4 rounded-2xl border border-foreground/10 p-4 transition hover:bg-foreground/5"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-foreground/10 p-4">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <ContactForm />
      </div>
    </main>
  );
}