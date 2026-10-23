import { strings } from "@/content/strings";
import { Section, StatementBlock } from "@/shared/ui";

export function AmbitionSection() {
  return (
    <Section top="sectionLarge">
      <StatementBlock {...strings.home.ambition} headingMeasure="980" bodyMeasure="660" />
    </Section>
  );
}
