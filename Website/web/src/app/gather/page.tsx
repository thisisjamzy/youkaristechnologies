import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { GatherView } from "@/views/Gather";

export const metadata: Metadata = pageMetadata(strings.common.meta.gather);

export default function GatherPage() {
  return <GatherView />;
}
