import { strings } from "@/content/strings";
import { Grid, Label, Mark, Section } from "@/shared/ui";
import styles from "./NameAndMarkSection.module.scss";

const { nameAndMark } = strings.ourStory;

export function NameAndMarkSection() {
  return (
    <Section top="fluid-96-152">
      <Grid min={80} gap={4}>
        <div className={styles.markCard}>
          <Mark size="fluid" alt={nameAndMark.markAlt} />
        </div>
        <div className={styles.textCard}>
          <Label>{nameAndMark.label}</Label>
          {nameAndMark.body.map((paragraph) => (
            <p key={paragraph} className={styles.text}>
              {paragraph}
            </p>
          ))}
          {/* Barlow Condensed 500 beside the mark, never the logo's Nohemi. */}
          <p className={styles.slogan}>{nameAndMark.slogan}</p>
        </div>
      </Grid>
    </Section>
  );
}
