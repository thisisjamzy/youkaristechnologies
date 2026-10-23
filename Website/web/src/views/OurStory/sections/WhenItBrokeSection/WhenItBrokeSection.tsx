import { strings } from "@/content/strings";
import { Heading, Label, Mark, Section, Text } from "@/shared/ui";
import reading from "../_shared/reading.module.scss";
import styles from "./WhenItBrokeSection.module.scss";

const { whenItBroke } = strings.ourStory;

export function WhenItBrokeSection() {
  const [story, inPerson] = whenItBroke.body;
  return (
    <Section as="article" width="reading" top="fluid-96-152" className={reading.column}>
      <Label>{whenItBroke.label}</Label>
      <Heading text={whenItBroke.headline} size="fluid-30-44" leading="1-08" />
      <Text variant="longform">{story}</Text>
      <div className={styles.card}>
        <Mark />
        <p className={styles.cardText}>{inPerson}</p>
      </div>
    </Section>
  );
}
