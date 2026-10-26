import type { LeadStatus } from "./types";

export const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  contacted: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300",
  viewing: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  negotiating: "bg-orange-500/15 text-orange-800 dark:text-orange-300",
  won: "bg-green-500/15 text-green-800 dark:text-green-300",
  lost: "bg-foreground/10 text-foreground/70",
};

export const statusBars: Record<LeadStatus, string> = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  viewing: "bg-purple-500",
  negotiating: "bg-orange-500",
  won: "bg-green-500",
  lost: "bg-foreground/40",
};