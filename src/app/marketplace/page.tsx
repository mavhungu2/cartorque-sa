import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import { listLiveListings, type ListingFilters } from "@/lib/listings";
import { applyListingFilters, buildListingFacets } from "@/lib/mock-listings";

export const metadata = {
  title: "Marketplace — Car Torque SA",
  description:
    "Honest South African car listings. Browse private cars for sale — every listing reviewed by Car Torque SA.",
};

function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: ListingFilters = {
    make: sp.make,
    model: sp.model,
    minPrice: parseNumber(sp.minPrice),
    maxPrice: parseNumber(sp.maxPrice),
    minYear: parseNumber(sp.minYear),
    maxYear: parseNumber(sp.maxYear),
    maxMileage: parseNumber(sp.maxMileage),
    province: sp.province,
    verifiedOnly: sp.verified === "1",
  };

  // One inventory fetch: facets come from the FULL live inventory (so filter
  // options always reflect what's actually for sale), results from filtering
  // it in memory.
  const inventory = await listLiveListings();
  const facets = buildListingFacets(inventory);
  const listings = applyListingFilters(inventory, filters);
  const activeFilters = Object.entries(filters).filter(([, v]) => v !== undefined && v !== false);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Marketplace</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cars for sale</h1>
          <Link href="/sell" className="btn-primary self-start md:self-auto">
            + Sell my car
          </Link>
        </div>
        <p className="text-[color:var(--muted)] max-w-2xl">
          Honest private car listings from across South Africa. Every listing is screened by the
          Car Torque team — and selected ones get a full video review on the channel.
        </p>
      </div>

      <div className="mt-10">
        <FilterBar facets={facets} initial={filters} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
        <div>
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
          {activeFilters.length > 0 && (
            <>
              {" — "}
              <Link href="/marketplace" className="underline">
                Clear filters
              </Link>
            </>
          )}
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <div className="mt-10 card rounded-xl p-10 text-center">
          <div className="text-lg font-semibold">No cars match those filters.</div>
          <p className="text-[color:var(--muted)] mt-2">Try widening the criteria or clearing filters.</p>
        </div>
      )}
    </div>
  );
}
