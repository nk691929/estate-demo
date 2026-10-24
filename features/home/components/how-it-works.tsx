import { CalendarCheck, KeyRound, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search",
    text: "Filter by type, price and area to find homes that fit what you need.",
  },
  {
    icon: CalendarCheck,
    title: "Visit",
    text: "Message us on WhatsApp or send an inquiry, and we arrange a viewing.",
  },
  {
    icon: KeyRound,
    title: "Move in",
    text: "We help with the paperwork until the keys are in your hand.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-1 text-foreground/60">Three simple steps</p>
      </div>

      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li
            key={title}
            className="relative rounded-2xl border border-foreground/10 p-6"
          >
            <span className="absolute right-5 top-4 text-5xl font-bold text-foreground/10">
              {index + 1}
            </span>
            <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-foreground/70">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}