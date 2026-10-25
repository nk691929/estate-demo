import { parsePropertyQuery, type RawSearchParams } from "../search-params";
import { PropertyFilterBar } from "./property-filter-bar";
import { PropertyResults } from "./property-results";

export async function PropertyListing({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parsePropertyQuery(await searchParams);

  return (
    <>
      <div className="mb-8">
        <PropertyFilterBar query={query} />
      </div>
      <PropertyResults query={query} />
    </>
  );
}