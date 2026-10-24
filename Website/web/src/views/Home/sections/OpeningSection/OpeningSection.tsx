import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import {
  ArrowLink,
  Button,
  FolderCard,
  FrostedCard,
  Heading,
  Label,
  Mark,
  Overlay,
  PhotoWithOverlay,
  Section,
  Text,
} from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const { opening } = strings.home;

export function OpeningSection() {
  return (
    <Section top="opening">
      <div className={styles.intro}>
        <Heading
          as="h1"
          text={opening.headline}
          size="displayXl"
          tracking="tightPlus"
          breakBefore
          secondSize="headingM"
          className={styles.headline}
        />
        <div className={styles.aside}>
          <Text variant="lead">{opening.body}</Text>
          <div className={styles.ctas}>
            <Button href={routes.join} arrow="right">
              {opening.primaryCta}
            </Button>
            <ArrowLink href={routes.buildWithUs} arrow={false} className={styles.secondary}>
              {opening.secondaryCta}
            </ArrowLink>
          </div>
        </div>
      </div>

      <PhotoWithOverlay
        name="gatherChurch"
        alt={opening.photoAlt}
        height="hero"
        focus="45"
        priority
        wrapperClassName={styles.photo}
      >
        <Overlay position="bottomLeft">
          <FrostedCard>
            <Mark />
            <p className={styles.photoCard}>{opening.photoCard}</p>
          </FrostedCard>
        </Overlay>
        <Overlay position="topRight" stackOnMobile className={styles.limeSlot}>
          <FolderCard tone="lime" tab="wide" radius="lg" className={styles.limeCard} bodyClassName={styles.limeBody}>
            <Label tone="primary">{opening.limeCard.label}</Label>
            <Heading as="span" text={opening.limeCard.value} size="48" />
            <span className={styles.limeCaption}>{opening.limeCard.caption}</span>
          </FolderCard>
        </Overlay>
      </PhotoWithOverlay>
    </Section>
  );
}
