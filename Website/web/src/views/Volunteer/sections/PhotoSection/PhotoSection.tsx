import { strings } from "@/content/strings";
import { Photo, Section } from "@/shared/ui";

const { photo } = strings.volunteer;

export function PhotoSection() {
  return (
    <Section top="fluid-40-64">
      <Photo name="buildTeam" alt={photo.photoAlt} height="team" radius="2xl" sizes="full" />
    </Section>
  );
}
