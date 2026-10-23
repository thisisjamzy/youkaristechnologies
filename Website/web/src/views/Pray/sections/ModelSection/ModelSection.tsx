import { strings } from "@/content/strings";
import { Heading, NumberedList, Photo, PhotoStrip, PullLine, Section, SplitHeader, Tag } from "@/shared/ui";
import styles from "./ModelSection.module.scss";

const { model } = strings.pray;
// A full Rosary: five decades.
const DECADES = 5;

export function ModelSection() {
  return (
    <Section top="section">
      <SplitHeader aside={model.intro}>
        <Tag bordered>{model.label}</Tag>
        <Heading text={model.headline} size="headingL" leading="1-02" />
      </SplitHeader>

      <div className={styles.week}>
        {model.days.map((day) => (
          <div key={day} className={styles.day}>
            <span className={styles.dayName}>{day}</span>
            <span className={styles.beads} aria-hidden="true">
              {Array.from({ length: DECADES }, (_, i) => (
                <span key={i} />
              ))}
            </span>
            <span className={styles.dayCaption}>{model.dayCaption}</span>
          </div>
        ))}
        <div className={styles.sunday}>
          <Photo name="massAltar" alt={model.sunday.photoAlt} height={27.5} radius="sm" sizes="quarter" />
          <span className={styles.dayName}>{model.sunday.label}</span>
          <span className={styles.sundayText}>{model.sunday.text}</span>
        </div>
      </div>

      <NumberedList items={model.steps} emphasizeLast className={styles.steps} />
      <PullLine text={model.pullLine} align="center" className={styles.pullLine} />
      <PhotoStrip
        className={styles.strip}
        photos={[
          { name: "womanPraying", alt: model.photoStripAlts[0], focus: "25" },
          { name: "youngManPraying", alt: model.photoStripAlts[1], focus: "30" },
          { name: "rosaryWalk", alt: model.photoStripAlts[2] },
        ]}
      />
    </Section>
  );
}
