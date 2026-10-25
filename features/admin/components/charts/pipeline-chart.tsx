import Link from "next/link";

import { statusBars } from "@/features/leads/status-styles";
import type { ChartData } from "../../services/chart.service";

export function PipelineChart({ items }: { items: ChartData["pipeline"] }) {
  const max = Math.max(1, ...items.map((item) => item.count));

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.status}>
          <Link
            href={`/admin/leads?status=${item.status}`}
            className="block rounded-lg transition hover:opacity-80"
          >
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div
              aria-hidden="true"
              className="h-2.5 overflow-hidden rounded-full bg-foreground/10"
            >
              <div
                className={`h-full rounded-full ${statusBars[item.status]}`}
                style={{
                  width:
                    item.count > 0
                      ? `${Math.max(3, (item.count / max) * 100)}%`
                      : "0%",
                }}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}