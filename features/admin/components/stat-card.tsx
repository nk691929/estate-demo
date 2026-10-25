import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const tones = {
  default: "bg-foreground/10 text-foreground",
  blue: "bg-blue-500/15 text-blue-400",
  yellow: "bg-yellow-500/15 text-yellow-400",
  green: "bg-green-500/15 text-green-400",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  tone?: keyof typeof tones;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">{label}</p>
        <span
          className={`flex size-9 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-foreground/50">{hint}</p>}
    </>
  );

  const className =
    "block rounded-2xl border border-foreground/10 p-5 transition";

  return href ? (
    <Link href={href} className={`${className} hover:bg-foreground/5`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}