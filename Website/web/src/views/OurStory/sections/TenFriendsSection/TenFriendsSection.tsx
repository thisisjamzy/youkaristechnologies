import { strings } from "@/content/strings";
import { Heading, Label, NumberCard, Photo, Section, Text } from "@/shared/ui";
import styles from "./TenFriendsSection.module.scss";

const { tenFriends } = strings.ourStory;

export function TenFriendsSection() {
  const [first, later] = tenFriends.numbers;
  return (
    <Section top="fluid-96-152" className={styles.section}>
      <div className={styles.copy}>
        <Label>{tenFriends.label}</Label>
        <Heading text={tenFriends.headline} size="fluid-32-52" leading="1-04" />
        <Text variant="longform">{tenFriends.body}</Text>
      </div>
      <div className={styles.cards}>
        <Photo name="womanPhone" alt={tenFriends.photoAlt} height={70} radius="xl" focus="30" sizes="half" className={styles.wide} />
        <NumberCard {...first} />
        <NumberCard {...later} tone="lime" />
      </div>
    </Section>
  );
}
