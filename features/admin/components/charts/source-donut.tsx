import type { ChartData } from "../../services/chart.service";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const strokes = {
  property: "stroke-blue-500",
  contact: "stroke-purple-500",
} as const;

const dots = {
  property: "bg-blue-500",
  contact: "bg-purple-500",
} as const;

export function SourceDonut({ items }: { items: ChartData["sources"] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground/60">
        No leads yet.
      </p>
    );
  }

  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg
        viewBox="0 0 100 100"
        className="size-36 shrink-0"
        role="img"
        aria-label={items
          .map((item) => `${item.label}: ${item.count}`)
          .join(", ")}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="14"
          className="stroke-foreground/10"
        />
        {items.map((item) => {
          const length = (item.count / total) * CIRCUMFERENCE;
          const circle = (
            <circle
              key={item.source}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="14"
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
              className={strokes[item.source]}
            />
          );
          offset += length;
          return circle;
        })}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="700"
          className="fill-foreground"
        >
          {total}
        </text>
      </svg>

      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.source} className="flex items-center gap-3">
            <span className={`size-3 rounded-full ${dots[item.source]}`} />
            <span>
              <span className="block font-medium">{item.label}</span>
              <span className="text-foreground/60">
                {item.count} ({Math.round((item.count / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}