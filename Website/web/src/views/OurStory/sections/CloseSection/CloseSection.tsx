import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, Heading, Section } from "@/shared/ui";
import styles from "./CloseSection.module.scss";

const { close } = strings.ourStory;

export function CloseSection() {
  return (
    <Section top="sectionLarge" bottom="fluid-96-140" className={styles.section}>
      <Heading text={close.headline} size="fluid-34-60" leading="1-05" measure="900" />
      <Button href={routes.join} arrow="right">
        {close.cta}
      </Button>
    </Section>
  );
}
