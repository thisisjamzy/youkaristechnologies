import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { HomeView } from "@/views/Home";

export const metadata: Metadata = pageMetadata(strings.common.meta.home);

export default function HomePage() {
  return <HomeView />;
}
