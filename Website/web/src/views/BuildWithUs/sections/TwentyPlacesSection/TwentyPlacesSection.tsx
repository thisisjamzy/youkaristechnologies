import { strings } from "@/content/strings";
import { Heading, Section, Text } from "@/shared/ui";
import { PlacesBadge } from "@/widgets";
import styles from "./TwentyPlacesSection.module.scss";

const { twentyPlaces } = strings.buildWithUs;

export type TwentyPlacesSectionProps = { placesLeft: number | null };

export function TwentyPlacesSection({ placesLeft }: TwentyPlacesSectionProps) {
  return (
    <Section top="sectionLarge" className={styles.section}>
      <Heading text={twentyPlaces.headline} size="fluid-40-76" tracking="tightPlus" className={styles.headline} />
      <div className={styles.aside}>
        <Text variant="lead" leading="1-65">
          {twentyPlaces.body}
        </Text>
        <PlacesBadge left={placesLeft} />
      </div>
    </Section>
  );
}
