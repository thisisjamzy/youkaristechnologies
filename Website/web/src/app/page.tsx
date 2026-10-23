import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { HomeView } from "@/views/Home";

const { meta } = strings.common;

export const metadata: Metadata = {
  title: meta.home.title,
  description: meta.home.description,
  openGraph: { title: meta.home.title, description: meta.home.description, images: [photos.prayHandsTogether] },
};

export default function HomePage() {
  // TODO(phase 8): read places left from the backend (cached); null hides the number.
  return <HomeView placesLeft={null} />;
}
