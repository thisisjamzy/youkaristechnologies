import { strings } from "@/content/strings";
import { Section, StatementBlock } from "@/shared/ui";

export function WhyVolunteerSection() {
  return (
    <Section top="sectionLarge">
      <StatementBlock {...strings.volunteer.whyVolunteer} gap="md" headingMeasure="940" bodyMeasure="660" />
    </Section>
  );
}
