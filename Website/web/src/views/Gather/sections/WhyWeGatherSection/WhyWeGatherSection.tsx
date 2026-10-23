import { strings } from "@/content/strings";
import { Heading, Label, PullLine, Section, Text } from "@/shared/ui";
import styles from "./WhyWeGatherSection.module.scss";

const { whyWeGather } = strings.gather;

export function WhyWeGatherSection() {
  return (
    <Section top="section" className={styles.section}>
      <div className={styles.side}>
        <Label>{whyWeGather.label}</Label>
        <Heading text={whyWeGather.headline} size="headingM" leading="1-05" />
      </div>
      <div className={`${styles.side} ${styles.copy}`}>
        <Text variant="lead" leading="1-65">
          {whyWeGather.body}
        </Text>
        <PullLine text={whyWeGather.closing} tone="primary" secondTone="blue" size="26" leading="1-2" />
      </div>
    </Section>
  );
}
