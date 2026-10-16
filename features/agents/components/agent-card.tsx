import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";

import type { Agent } from "../types";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10">
      <div className="relative aspect-square">
        <Image
          src={agent.photo}
          alt={agent.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="text-xl font-bold">{agent.name}</h2>
          <p className="text-sm text-foreground/60">{agent.role}</p>
        </div>
        <p className="text-sm text-foreground/70">{agent.bio}</p>
        <p className="text-sm font-medium">
          {agent.experienceYears} years experience
        </p>

        <div className="flex gap-2 pt-2">
          <a
            href={`tel:${agent.phone.replace(/\s/g, "")}`}
            aria-label={`Call ${agent.name}`}
            className="flex size-10 items-center justify-center rounded-full border border-foreground/20 transition hover:bg-foreground/5"
          >
            <Phone className="size-4" />
          </a>
          <a
            href={`https://wa.me/${agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${agent.name}`}
            className="flex size-10 items-center justify-center rounded-full border border-foreground/20 transition hover:bg-foreground/5"
          >
            <MessageCircle className="size-4" />
          </a>
          <a
            href={`mailto:${agent.email}`}
            aria-label={`Email ${agent.name}`}
            className="flex size-10 items-center justify-center rounded-full border border-foreground/20 transition hover:bg-foreground/5"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}