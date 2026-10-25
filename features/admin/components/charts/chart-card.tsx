export function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-foreground/10 p-5 ${className}`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-foreground/60">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}