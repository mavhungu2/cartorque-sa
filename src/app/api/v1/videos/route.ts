import { CHANNEL, VIDEOS, CATEGORIES } from "@/lib/data";

export async function GET() {
  return Response.json(
    { channel: CHANNEL, videos: VIDEOS, categories: CATEGORIES },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" } },
  );
}
