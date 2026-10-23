import { strings } from "@/content/strings";
import { Heading, Label, Mark, Section, Text } from "@/shared/ui";
import styles from "./YoukarisSection.module.scss";

const { youkaris } = strings.pray;
// Day 3 of 6 this week.
const days = [true, true, true, false, false, false];

export function YoukarisSection() {
  return (
    <Section top="section">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <Label>{youkaris.label}</Label>
          <Heading text={youkaris.headline} size="headingM" leading="1-05" />
          <Text variant="lead" leading="1-65">
            {youkaris.body}
          </Text>
        </div>
        {/* An illustration of the app, built in code. Decorative: the copy says it all. */}
        <div className={styles.phone} aria-hidden="true">
          <div className={styles.screen}>
            <Mark variant="lime" size="md" />
            <Label size="13" tone="onDarkMuted">
              {youkaris.phone.eyebrow}
            </Label>
            <div className={styles.intention}>{youkaris.phone.prompt}</div>
            <span className={styles.bars}>
              {days.map((done, i) => (
                <span key={i} className={done ? styles.done : styles.todo} />
              ))}
            </span>
            <span className={styles.progress}>{youkaris.phone.progress}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
