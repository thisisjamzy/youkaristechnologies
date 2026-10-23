import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { getPlacesLeft } from "@/features/show-places-left";
import { photos } from "@/shared/lib";
import { BuildWithUsView } from "@/views/BuildWithUs";

const { title, description } = strings.common.meta.buildWithUs;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.buildTeam] },
};

export default async function BuildWithUsPage() {
  // Cached for 5 minutes; null (backend unreachable) hides the number.
  const placesLeft = await getPlacesLeft();
  return <BuildWithUsView placesLeft={placesLeft} />;
}
