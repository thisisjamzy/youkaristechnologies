import { strings } from "@/content/strings";
import { Heading, NumberedList, Section, SplitHeader, Tag } from "@/shared/ui";
import styles from "./GiftTravelsSection.module.scss";

const { giftTravels } = strings.give;

export function GiftTravelsSection() {
  return (
    <Section top="section">
      <SplitHeader>
        <Tag bordered>{giftTravels.label}</Tag>
        <Heading text={giftTravels.headline} size="headingL" leading="1-02" />
      </SplitHeader>
      <NumberedList items={giftTravels.steps} variant="joined" className={styles.steps} />
    </Section>
  );
}
