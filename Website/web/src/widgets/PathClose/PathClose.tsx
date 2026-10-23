import type { ReactNode } from "react";
import type { MeasureName } from "@/styles/tokens/tokens";
import type { TwoTone } from "@/shared/types";
import { Heading, Section, Text } from "@/shared/ui";
import styles from "./PathClose.module.scss";

export type PathCloseProps = {
  headline: string | TwoTone;
  body: string;
  bodyMeasure?: MeasureName;
  /** The join button, and on Give the "Build it with us" link. */
  actions: ReactNode;
  /** The <PathSwitcher> to the other two paths (passed in: widgets do not import each other). */
  switcher: ReactNode;
};

/** The end of Pray, Give and Gather: a centred close, then cards to the other two paths. */
export function PathClose({ headline, body, bodyMeasure = "560", actions, switcher }: PathCloseProps) {
  return (
    <Section top="sectionLarge" bottom="fluid-96-140" className={styles.section}>
      <div className={styles.close}>
        <Heading text={headline} size="fluid-36-64" leading="1-04" />
        <Text variant="lead" size="19" leading="1-6" measure={bodyMeasure}>
          {body}
        </Text>
        <div className={styles.actions}>{actions}</div>
      </div>
      {switcher}
    </Section>
  );
}
