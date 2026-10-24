import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4">
      <div className="rounded-3xl bg-foreground px-6 py-12 text-center text-background md:px-12">
        <h2 className="text-3xl font-bold">Ready to find your next property?</h2>
        <p className="mx-auto mt-2 max-w-xl text-background/70">
          Tell us what you are looking for and we will get back to you quickly.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-lg border border-background/30 px-5 py-3 text-sm font-medium transition hover:bg-background/10"
          >
            <Phone className="size-4" />
            Call us
          </a>
          <Link
            href="/contact"
            className="rounded-lg border border-background/30 px-5 py-3 text-sm font-medium transition hover:bg-background/10"
          >
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}