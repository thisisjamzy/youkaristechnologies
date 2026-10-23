import { strings } from "@/content/strings";
import { Heading, Label, PullLine, Section, Text } from "@/shared/ui";
import styles from "./WhoWeAreSection.module.scss";

const { whoWeAre } = strings.home;

export function WhoWeAreSection() {
  return (
    <Section top="section" className={styles.section}>
      <Label>{whoWeAre.label}</Label>
      <Heading text={whoWeAre.headline} size="displayL" leading="1-04" measure="940" />
      <Text variant="lead" size="19" leading="1-6" measure="620">
        {whoWeAre.body}
      </Text>
      <PullLine
        text={whoWeAre.closing}
        tone="primary"
        secondTone="blue"
        breakBefore
        size="fluid-24-34"
        leading="1-2"
        align="center"
        className={styles.closing}
      />
    </Section>
  );
}
