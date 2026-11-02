import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, Heading, PullLine, Section, Text } from "@/shared/ui";
import styles from "./HowToVolunteerSection.module.scss";

const { howToVolunteer } = strings.volunteer;

export function HowToVolunteerSection() {
  return (
    <Section top="sectionLarge" bottom="fluid-96-140">
      <div className={styles.panel}>
        <div className={styles.intro}>
          <Heading text={howToVolunteer.headline} size="headingM" leading="1-04" />
          <Text leading="1-65" size="17">
            {howToVolunteer.body}
          </Text>
          <Button href={routes.roles} variant="dark" size="large" arrow="right" className={styles.cta}>
            {howToVolunteer.cta}
          </Button>
        </div>
        <ol className={styles.steps}>
          {howToVolunteer.steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <b className={styles.title}>{step.title}</b>
              <span className={styles.text}>{step.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <PullLine
        text={howToVolunteer.closing}
        tone="primary"
        size="fluid-26-40"
        align="center"
        className={styles.closing}
      />
    </Section>
  );
}
