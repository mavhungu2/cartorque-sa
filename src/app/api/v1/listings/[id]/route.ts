import { getListing } from "@/lib/listings";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return Response.json(
      { error: { code: "not_found", message: "Listing not found or no longer live." } },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }
  return Response.json({ listing }, { headers: { "Cache-Control": CACHE } });
}
