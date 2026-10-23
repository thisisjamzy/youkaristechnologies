import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { GatherView } from "@/views/Gather";

const { title, description } = strings.common.meta.gather;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.gatherCrowd] },
};

export default function GatherPage() {
  return <GatherView />;
}
