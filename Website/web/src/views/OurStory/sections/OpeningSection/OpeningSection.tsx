import { strings } from "@/content/strings";
import { Heading, Photo, Section, Tag, Text } from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const { opening } = strings.ourStory;

export function OpeningSection() {
  return (
    <>
      <Section top="fluid-48-96" className={styles.intro}>
        <Tag bordered>{opening.label}</Tag>
        <Heading
          as="h1"
          text={opening.headline}
          size="fluid-48-100"
          leading="0-98"
          tracking="tighter"
          measure="960"
        />
        <Text size="20" leading="1-6" measure="620">
          {opening.body}
        </Text>
      </Section>
      <Section top="fluid-48-80">
        <Photo name="storyCampus" alt={opening.photoAlt} height="story" focus="35" priority />
      </Section>
    </>
  );
}
