import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { getPlacesLeft } from "@/features/show-places-left";
import { photos } from "@/shared/lib";
import { HomeView } from "@/views/Home";

const { meta } = strings.common;

export const metadata: Metadata = {
  title: meta.home.title,
  description: meta.home.description,
  openGraph: { title: meta.home.title, description: meta.home.description, images: [photos.prayHandsTogether] },
};

export default async function HomePage() {
  // Cached for 5 minutes; null (backend unreachable) hides the number.
  const placesLeft = await getPlacesLeft();
  return <HomeView placesLeft={placesLeft} />;
}
