import { strings } from "@/content/strings";
import { Heading, Photo, Section, Tag, Text } from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const { opening } = strings.ourStory;

export function OpeningSection() {
  return (
    <Section top="fluid-48-96" className={styles.opening}>
      <Tag bordered>{opening.label}</Tag>
      <div className={styles.intro}>
        <Heading
          as="h1"
          text={opening.headline}
          size="fluid-44-96"
          leading="0-98"
          tracking="tighter"
          className={styles.headline}
        />
        <Text variant="lead" size="19" leading="1-6" className={styles.lead}>
          {opening.body}
        </Text>
      </div>
      <Photo
        name="storyChurchRow"
        alt={opening.photoAlt}
        height="story"
        focus="35"
        priority
        className={styles.photo}
      />
    </Section>
  );
}
