import { strings } from "@/content/strings";
import { Heading, Section, Text } from "@/shared/ui";
import styles from "./HowOftenSection.module.scss";

const { howOften } = strings.gather;

export function HowOftenSection() {
  return (
    <Section top="section">
      <div className={styles.panel}>
        {/* Decorative: the heading says "Twice a year". */}
        <p className={styles.number} aria-hidden="true">
          {howOften.number}
        </p>
        <div className={styles.copy}>
          <Heading text={howOften.headline} size="fluid-30-44" leading="1-05" />
          <Text variant="lead" leading="1-65">
            {howOften.body}
          </Text>
        </div>
      </div>
    </Section>
  );
}
