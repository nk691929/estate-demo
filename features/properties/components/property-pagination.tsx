import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { propertiesHref } from "../search-params";
import type { PropertyQuery } from "../services/property.service";

function pageWindow(page: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...wanted]
    .filter((item) => item >= 1 && item <= total)
    .sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  pages.forEach((item, index) => {
    if (index > 0 && item - pages[index - 1] > 1) result.push("gap");
    result.push(item);
  });

  return result;
}

const base =
  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm";

export function PropertyPagination({
  query,
  page,
  totalPages,
}: {
  query: PropertyQuery;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => propertiesHref(query, { page: target });

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="Previous page"
          className={`${base} border-foreground/20 transition hover:bg-foreground/5`}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${base} border-foreground/10 text-foreground/30`}
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageWindow(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-foreground/50">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${base} transition ${
              item === page
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 hover:bg-foreground/5"
            }`}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          aria-label="Next page"
          className={`${base} border-foreground/20 transition hover:bg-foreground/5`}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${base} border-foreground/10 text-foreground/30`}
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}