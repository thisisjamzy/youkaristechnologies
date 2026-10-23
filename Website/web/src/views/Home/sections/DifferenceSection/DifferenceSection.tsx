import { strings } from "@/content/strings";
import { Heading, NumberedList, Section, SplitHeader } from "@/shared/ui";
import styles from "./DifferenceSection.module.scss";

const { difference } = strings.home;

export function DifferenceSection() {
  return (
    <Section top="section">
      <SplitHeader aside={difference.intro} asideSize="18">
        <Heading text={difference.headline} size="fluid-40-76" tracking="tightPlus" secondTone="highlight" />
      </SplitHeader>
      <NumberedList items={difference.reasons} titleStyle="display" rule="mist" className={styles.list} />
    </Section>
  );
}
