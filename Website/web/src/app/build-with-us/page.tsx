import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { getPlacesLeft } from "@/features/show-places-left";
import { BuildWithUsView } from "@/views/BuildWithUs";

export const metadata: Metadata = pageMetadata(strings.common.meta.buildWithUs);

export default async function BuildWithUsPage() {
  // Cached for 5 minutes; null (backend unreachable) hides the number.
  const placesLeft = await getPlacesLeft();
  return <BuildWithUsView placesLeft={placesLeft} />;
}
