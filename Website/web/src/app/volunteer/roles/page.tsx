import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { RolesView } from "@/views/Roles";

export const metadata: Metadata = pageMetadata(strings.common.meta.roles);

export default function RolesPage() {
  return <RolesView />;
}
