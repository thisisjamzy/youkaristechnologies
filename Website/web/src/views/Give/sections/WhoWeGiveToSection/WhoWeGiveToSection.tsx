import { strings } from "@/content/strings";
import { Heading, Label, Photo, Section, Text } from "@/shared/ui";
import styles from "./WhoWeGiveToSection.module.scss";

const { whoWeGiveTo } = strings.give;

export function WhoWeGiveToSection() {
  return (
    <Section top="section" className={styles.section}>
      <Photo name="giveTable" alt={whoWeGiveTo.photoAlt} height={110} sizes="half" className={styles.photo} />
      <div className={styles.copy}>
        <Label>{whoWeGiveTo.label}</Label>
        <Heading text={whoWeGiveTo.headline} size="headingM" leading="1-05" />
        {whoWeGiveTo.body.map((paragraph) => (
          <Text key={paragraph} variant="lead" leading="1-65">
            {paragraph}
          </Text>
        ))}
      </div>
    </Section>
  );
}
