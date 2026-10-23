import { strings } from "@/content/strings";
import { Heading, Section, Text } from "@/shared/ui";
import styles from "./RoomOfPaulsSection.module.scss";

const { roomOfPauls } = strings.gather;

export function RoomOfPaulsSection() {
  return (
    <Section top="section" className={styles.section}>
      <Heading text={roomOfPauls.headline} size="displayL" leading="1-02" tracking="tightPlus" className={styles.headline} />
      <Text variant="lead" leading="1-65" className={styles.body}>
        {roomOfPauls.body}
      </Text>
    </Section>
  );
}
