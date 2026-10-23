import { strings } from "@/content/strings";
import { Accordion, Heading, Photo, Section } from "@/shared/ui";
import styles from "./QuestionsSection.module.scss";

const { questions } = strings.pray;

export function QuestionsSection() {
  return (
    <Section top="section" className={styles.section}>
      <div className={styles.side}>
        <Heading text={questions.headline} size="headingM" leading="1-05" />
        <Photo name="churchPraying" alt={questions.photoAlt} height={85} radius="lg" sizes="third" />
      </div>
      <Accordion items={questions.items} className={styles.list} />
    </Section>
  );
}
