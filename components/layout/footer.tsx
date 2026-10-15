import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xl font-bold text-white">{siteConfig.name}</p>
          <p className="text-sm">{siteConfig.tagline}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">Quick links</p>
          <ul className="space-y-2">
            <li>
              <Link href="/properties" className="hover:text-white">
                Properties
              </Link>
            </li>
            <li>
              <Link href="/agents" className="hover:text-white">
                Agents
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">Contact</p>
          <p className="flex items-center gap-2">
            <Phone className="size-4" />
            {siteConfig.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4" />
            {siteConfig.email}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4" />
            {siteConfig.address}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}