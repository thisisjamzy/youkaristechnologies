import { getPlaces } from "@/features/show-places-left";

/** GET /api/places: core team places, cached for 5 minutes (see getPlaces). */
export async function GET() {
  const places = await getPlaces();
  if (!places) return Response.json({ ok: false }, { status: 503 });
  return Response.json({ ok: true, ...places });
}
