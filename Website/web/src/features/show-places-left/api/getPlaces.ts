import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { parsePlaces, placesLeftToShow, type Places } from "@/entities/core-team";
import { appsScriptGet } from "@/shared/lib/appsScript";

/** Tag for the cached places; /api/signup expires it after a core team application. */
export const PLACES_TAG = "core-team-places";

/**
 * Core team places from the backend, cached for 5 minutes. Null when the backend is
 * unreachable or replies oddly, so the site hides the number rather than guessing.
 */
export async function getPlaces(): Promise<Places | null> {
  "use cache";
  cacheTag(PLACES_TAG);
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  return parsePlaces(await appsScriptGet("places"));
}

/** The number to show on the pages: places left, 0 when closed, null when unknown. */
export async function getPlacesLeft(): Promise<number | null> {
  return placesLeftToShow(await getPlaces());
}
