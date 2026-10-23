import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { OurStoryView } from "@/views/OurStory";

const { title, description } = strings.common.meta.ourStory;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.storyCampus] },
};

export default function OurStoryPage() {
  return <OurStoryView />;
}
