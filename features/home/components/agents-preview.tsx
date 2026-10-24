import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import type { Agent } from "@/features/agents/types";

export function AgentsPreview({ agents }: { agents: Agent[] }) {
  const shown = agents.slice(0, 3);

  if (shown.length === 0) return null;

  return (
    <section className="bg-foreground/5 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          title="Meet our agents"
          subtitle="Experienced people who will guide you"
          centered
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((agent) => (
            <Link
              key={agent.id}
              href="/agents"
              className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-background p-5 transition hover:shadow-lg"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-foreground/10">
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <span>
                <span className="block text-lg font-semibold">{agent.name}</span>
                <span className="block text-sm text-foreground/60">
                  {agent.role}
                </span>
                <span className="mt-1 block text-xs text-foreground/50">
                  {agent.experienceYears} years of experience
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/agents"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            See all agents
          </Link>
        </div>
      </div>
    </section>
  );
}