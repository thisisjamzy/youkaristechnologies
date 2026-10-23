import { strings } from "@/content/strings";
import { Chip, Heading, Overlay, PhotoWithOverlay, PullLine, Section, Tag, Text } from "@/shared/ui";
import styles from "./ChallengeSection.module.scss";

const { challenge } = strings.home;

export function ChallengeSection() {
  return (
    <Section top="section" className={styles.section}>
      <div className={styles.panel}>
        <Tag>{challenge.label}</Tag>
        <Heading text={challenge.headline} size="headingM" leading="1-05" />
        <PhotoWithOverlay
          name="challengeAlone"
          alt={challenge.photoAlt}
          height={85}
          radius="lg"
          focus="30"
          sizes="half"
        >
          <Overlay position="bottomEdge" inset={3.5}>
            {challenge.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </Overlay>
        </PhotoWithOverlay>
      </div>
      <div className={styles.copy}>
        {challenge.body.map((paragraph) => (
          <Text key={paragraph} variant="lead" size="19" leading="1-65">
            {paragraph}
          </Text>
        ))}
        <PullLine text={challenge.pullLine} tone="primary" size="fluid-24-32" />
      </div>
    </Section>
  );
}
