import { strings } from "@/content/strings";
import { Section, StatementBlock } from "@/shared/ui";

export function AmbitionSection() {
  return (
    <Section top="sectionLarge">
      <StatementBlock {...strings.pray.ambition} headingMeasure="960" bodyMeasure="640" />
    </Section>
  );
}
