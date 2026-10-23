import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { OurStoryView } from "@/views/OurStory";

export const metadata: Metadata = pageMetadata(strings.common.meta.ourStory);

export default function OurStoryPage() {
  return <OurStoryView />;
}
