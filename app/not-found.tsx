import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <p className="text-6xl font-bold">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-foreground/60">
          The page you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/properties"
          className="mt-6 rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-80"
        >
          Browse properties
        </Link>
      </main>
      <Footer />
    </>
  );
}