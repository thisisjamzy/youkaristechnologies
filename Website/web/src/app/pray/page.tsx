import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { photos } from "@/shared/lib";
import { PrayView } from "@/views/Pray";

const { title, description } = strings.common.meta.pray;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [photos.prayOpenHands] },
};

export default function PrayPage() {
  return <PrayView />;
}
