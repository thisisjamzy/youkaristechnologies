import { strings } from "@/content/strings";
import { Heading, Label, Photo, Section, Text } from "@/shared/ui";
import styles from "./WhyWeAreBackSection.module.scss";

const { whyWeAreBack } = strings.ourStory;

export function WhyWeAreBackSection() {
  return (
    <Section top="fluid-96-152" className={styles.section}>
      <Photo name="storyPrayingRoom" alt={whyWeAreBack.photoAlt} height={115} sizes="half" className={styles.photo} />
      <div className={styles.copy}>
        <Label>{whyWeAreBack.label}</Label>
        <Heading text={whyWeAreBack.headline} size="headingM" leading="1-05" />
        <Text variant="longform">{whyWeAreBack.body}</Text>
      </div>
    </Section>
  );
}
