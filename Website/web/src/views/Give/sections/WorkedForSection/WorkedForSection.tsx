import { strings } from "@/content/strings";
import { Heading, PullLine, Section, Tag, Text } from "@/shared/ui";
import styles from "./WorkedForSection.module.scss";

const { workedFor } = strings.give;

export function WorkedForSection() {
  return (
    <Section top="section">
      <div className={styles.panel}>
        <div className={styles.side}>
          <Tag variant="lime">{workedFor.label}</Tag>
          <Heading text={workedFor.headline} size="headingL" leading="1-02" />
        </div>
        <div className={styles.copy}>
          {workedFor.body.map((paragraph) => (
            <Text key={paragraph} variant="lead" leading="1-65">
              {paragraph}
            </Text>
          ))}
          <PullLine text={workedFor.pullLine} tone="primary" size="24" leading="1-2" className={styles.pull} />
        </div>
      </div>
      <PullLine text={workedFor.pullCaption} align="center" className={styles.caption} />
    </Section>
  );
}
