import { strings } from "@/content/strings";
import { Heading, Label, Photo, Section, Text } from "@/shared/ui";
import reading from "../_shared/reading.module.scss";
import styles from "./WhatWeKnewSection.module.scss";

const { whatWeKnew } = strings.ourStory;

export function WhatWeKnewSection() {
  return (
    <>
      <Section top="fluid-96-152">
        <Heading
          as="p"
          text={whatWeKnew.pullQuote}
          size="fluid-40-88"
          tracking="tighter"
          secondTone="highlight"
          className={styles.quote}
        />
      </Section>
      <Section as="article" width="reading" top={14} className={reading.column}>
        <Label>{whatWeKnew.label}</Label>
        <Text variant="longform">{whatWeKnew.body}</Text>
        <Photo name="bwRosaryHands" alt={whatWeKnew.photoAlt} height={110} radius="lg" sizes="half" className={reading.photo} />
      </Section>
    </>
  );
}
