import { mockAgents } from "../data/mock-agents";
import type { Agent } from "../types";

export async function getAgents(): Promise<Agent[]> {
  return mockAgents;
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  return mockAgents.find((agent) => agent.id === id);
}