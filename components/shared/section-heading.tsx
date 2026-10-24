export function SectionHeading({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mb-10 text-center" : "mb-8"}>
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && <p className="mt-1 text-foreground/60">{subtitle}</p>}
    </div>
  );
}