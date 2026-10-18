export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8" aria-busy="true">
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-foreground/10" />
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-foreground/10 md:aspect-auto md:h-[480px]" />
      <div className="mt-8 space-y-4">
        <div className="h-8 w-2/3 animate-pulse rounded bg-foreground/10" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-foreground/10" />
      </div>
    </main>
  );
}