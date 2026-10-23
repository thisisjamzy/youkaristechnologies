import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, FolderCard, Heading, Section, Tag, Text } from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const { opening } = strings.buildWithUs;

export type OpeningSectionProps = { placesLeft: number | null };

export function OpeningSection({ placesLeft }: OpeningSectionProps) {
  return (
    <Section top="opening" className={styles.section}>
      <div className={styles.copy}>
        <Tag bordered>{opening.label}</Tag>
        <Heading as="h1" text={opening.headline} size="displayXl" tracking="tightPlus" />
        <Text variant="lead" leading="1-65" measure="640">
          {opening.body}
        </Text>
        <Button href={routes.apply} arrow="down" className={styles.cta}>
          {opening.cta}
        </Button>
      </div>
      <div className={styles.cardColumn}>
        <FolderCard tone="lime" tab="wide" tabHeight="lg" bodyClassName={styles.card}>
          <div className={styles.row}>
            <span className={styles.number}>{opening.placesCard.total}</span>
            <span className={styles.caption}>{opening.placesCard.totalCaption}</span>
          </div>
          {/* The second line needs the live number; it is hidden rather than guessed. */}
          {placesLeft !== null && (
            <>
              <div className={styles.rule} />
              <div className={styles.row}>
                <span className={styles.number}>{placesLeft}</span>
                <span className={styles.caption}>{opening.placesCard.openCaption}</span>
              </div>
            </>
          )}
        </FolderCard>
      </div>
    </Section>
  );
}
