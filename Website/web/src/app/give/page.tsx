import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { GiveView } from "@/views/Give";

export const metadata: Metadata = pageMetadata(strings.common.meta.give);

export default function GivePage() {
  return <GiveView />;
}
