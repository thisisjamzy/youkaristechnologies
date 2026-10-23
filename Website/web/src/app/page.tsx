import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { getPlacesLeft } from "@/features/show-places-left";
import { HomeView } from "@/views/Home";

export const metadata: Metadata = pageMetadata(strings.common.meta.home);

export default async function HomePage() {
  // Cached for 5 minutes; null (backend unreachable) hides the number.
  const placesLeft = await getPlacesLeft();
  return <HomeView placesLeft={placesLeft} />;
}
