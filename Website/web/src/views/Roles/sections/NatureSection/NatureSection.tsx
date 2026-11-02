import { strings } from "@/content/strings";
import { natureOfTheWork } from "@/entities/role";
import { Heading, Section, SplitHeader } from "@/shared/ui";
import styles from "./NatureSection.module.scss";

const { nature } = strings.roles;

/** What volunteering here is and is not. It must stay readable: nobody should mistake a role for paid work. */
export function NatureSection() {
  return (
    <Section top="section" id="nature">
      <SplitHeader aside={nature.body} className={styles.header}>
        <Heading text={nature.headline} size="headingL" leading="1-02" measure="760" />
      </SplitHeader>
      <ul className={styles.panel}>
        {natureOfTheWork.map((item) => (
          <li key={item.title} className={styles.item}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
