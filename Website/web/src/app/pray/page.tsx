import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { PrayView } from "@/views/Pray";

export const metadata: Metadata = pageMetadata(strings.common.meta.pray);

export default function PrayPage() {
  return <PrayView />;
}
