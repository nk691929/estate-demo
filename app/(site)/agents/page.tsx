import type { Metadata } from "next";

import { AgentCard } from "@/features/agents/components/agent-card";
import { getAgents } from "@/features/agents/services/agent.service";

export const metadata: Metadata = {
  title: "Our agents",
  description: "Meet the experienced property consultants at our agency.",
};

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Our agents</h1>
      <p className="mb-8 mt-1 text-foreground/60">
        Experienced people who will guide you from first visit to final deal.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </main>
  );
}