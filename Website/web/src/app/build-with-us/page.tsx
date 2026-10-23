import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { BuildWithUsView } from "@/views/BuildWithUs";

const { title, description } = strings.common.meta.buildWithUs;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.buildTeam] },
};

export default function BuildWithUsPage() {
  // TODO(phase 8): read places left from the backend (cached); null hides the number.
  return <BuildWithUsView placesLeft={null} />;
}
