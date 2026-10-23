import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { GiveView } from "@/views/Give";

const { title, description } = strings.common.meta.give;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.giveOutreach] },
};

export default function GivePage() {
  return <GiveView />;
}
