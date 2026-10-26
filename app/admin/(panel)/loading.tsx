export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded bg-foreground/10" />
      <div className="mt-3 h-4 w-40 animate-pulse rounded bg-foreground/10" />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-foreground/10"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-foreground/10 lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-foreground/10" />
      </div>
    </main>
  );
}