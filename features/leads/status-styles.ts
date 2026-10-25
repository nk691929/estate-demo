import type { LeadStatus } from "./types";

export const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-400",
  contacted: "bg-yellow-500/15 text-yellow-400",
  viewing: "bg-purple-500/15 text-purple-400",
  negotiating: "bg-orange-500/15 text-orange-400",
  won: "bg-green-500/15 text-green-400",
  lost: "bg-foreground/10 text-foreground/60",
};