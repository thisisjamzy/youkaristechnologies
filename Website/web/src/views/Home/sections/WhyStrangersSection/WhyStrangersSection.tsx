import { strings } from "@/content/strings";
import { Heading, Section, Text } from "@/shared/ui";
import styles from "./WhyStrangersSection.module.scss";

const { whyStrangers } = strings.home;

export function WhyStrangersSection() {
  return (
    <Section top="section" className={styles.section}>
      <Heading text={whyStrangers.headline} size="fluid-44-88" leading="0-98" tracking="tighter" className={styles.headline} />
      <Text variant="lead" leading="1-65" className={styles.body}>
        {whyStrangers.body}
      </Text>
    </Section>
  );
}
