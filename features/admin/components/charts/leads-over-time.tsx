import type { DayPoint } from "../../services/chart.service";

export function LeadsOverTime({ days }: { days: DayPoint[] }) {
  const max = Math.max(1, ...days.map((day) => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const busiest = days.reduce((best, day) => (day.count > best.count ? day : best));

  if (total === 0) {
    return (
      <p className="py-12 text-center text-sm text-foreground/60">
        No leads in the last 30 days.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-foreground/70">
        <span className="text-2xl font-bold text-foreground">{total}</span>{" "}
        leads · busiest day {busiest.label} ({busiest.count})
      </p>

      <div aria-hidden="true" className="flex h-44 items-end gap-[3px]">
        {days.map((day) => (
          <div
            key={day.key}
            title={`${day.label}: ${day.count} ${day.count === 1 ? "lead" : "leads"}`}
            className="flex h-full flex-1 items-end"
          >
            <div
              className={`w-full rounded-t ${
                day.count > 0
                  ? "bg-foreground/80 hover:bg-foreground"
                  : "bg-foreground/15"
              }`}
              style={{
                height:
                  day.count > 0
                    ? `${Math.max(4, (day.count / max) * 100)}%`
                    : "2px",
              }}
            />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="mt-2 flex justify-between text-xs text-foreground/50"
      >
        <span>{days[0].label}</span>
        <span>{days[Math.floor(days.length / 2)].label}</span>
        <span>{days[days.length - 1].label}</span>
      </div>

      <table className="sr-only">
        <caption>Leads per day over the last 30 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Leads</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.key}>
              <td>{day.label}</td>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}