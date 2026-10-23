import { strings } from "@/content/strings";
import { Grid, Heading, Label, Photo, Section, Text } from "@/shared/ui";
import split from "../_shared/split.module.scss";
import styles from "./RosaryAndHabitSection.module.scss";

const { rosaryAndHabit } = strings.pray;
const { cana, neverThank, habit } = rosaryAndHabit;

export function RosaryAndHabitSection() {
  return (
    <Section top="section" className={styles.section}>
      <Grid min={75} gap={3}>
        <Photo name="rosaryClose" alt={rosaryAndHabit.photoAlts[0]} height={105} radius="lg" sizes="half" />
        <Photo name="passRosary" alt={rosaryAndHabit.photoAlts[1]} height={105} radius="lg" sizes="half" />
      </Grid>

      <div className={split.row}>
        <div className={split.side}>
          <Label>{cana.label}</Label>
          <Heading text={cana.headline} size="headingM" leading="1-05" />
        </div>
        <div className={split.side}>
          {cana.body.map((paragraph) => (
            <Text key={paragraph} variant="lead" leading="1-65">
              {paragraph}
            </Text>
          ))}
        </div>
      </div>

      {[neverThank, habit].map((block) => (
        <div key={block.label} className={`${split.row} ${styles.ruled}`}>
          <div className={split.side}>
            <Label>{block.label}</Label>
            <Heading text={block.headline} size="headingM" leading="1-05" />
          </div>
          <Text variant="lead" leading="1-65" className={split.side}>
            {block.body}
          </Text>
        </div>
      ))}
    </Section>
  );
}
