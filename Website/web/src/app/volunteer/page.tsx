import type { Metadata } from "next";
import { pageMetadata } from "@/core/config/metadata";
import { strings } from "@/content/strings";
import { VolunteerView } from "@/views/Volunteer";

export const metadata: Metadata = pageMetadata(strings.common.meta.volunteer);

export default function VolunteerPage() {
  return <VolunteerView />;
}
