import { type NextRequest } from "next/server";
import { listLiveListings } from "@/lib/listings";
import { applyListingFilters, buildListingFacets, type ListingFilters } from "@/lib/mock-listings";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

function num(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const filters: ListingFilters = {
    make: sp.get("make") ?? undefined,
    model: sp.get("model") ?? undefined,
    minPrice: num(sp.get("minPrice")),
    maxPrice: num(sp.get("maxPrice")),
    minYear: num(sp.get("minYear")),
    maxYear: num(sp.get("maxYear")),
    maxMileage: num(sp.get("maxMileage")),
    province: sp.get("province") ?? undefined,
    verifiedOnly: sp.get("verifiedOnly") === "1",
  };

  const inventory = await listLiveListings();
  const facets = buildListingFacets(inventory);
  const listings = applyListingFilters(inventory, filters);

  return Response.json(
    {
      listings,
      facets,
      total: listings.length,
      // Reserved for future server-side pagination; clients must tolerate non-null.
      nextCursor: null,
    },
    { headers: { "Cache-Control": CACHE } },
  );
}
