import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowIcon, Heading, Section, SmartLink } from "@/shared/ui";
import { PlacesBadge } from "@/widgets";
import styles from "./BuildBandSection.module.scss";

const { buildBand } = strings.home;

export type BuildBandSectionProps = {
  /** Core team places left, or null when unknown (the badge then hides). */
  placesLeft: number | null;
};

/** The one large lime element on its screen: the call to build the core team. */
export function BuildBandSection({ placesLeft }: BuildBandSectionProps) {
  return (
    <Section top="sectionLarge">
      <div className={styles.band}>
        <Heading text={buildBand.headline} size="fluid-34-56" leading="1-02" className={styles.headline} />
        <div className={styles.aside}>
          <p className={styles.body}>{buildBand.body}</p>
          <PlacesBadge left={placesLeft} />
        </div>
        <SmartLink href={routes.buildWithUs} aria-label={buildBand.linkAria} className={styles.link}>
          <ArrowIcon direction="upRight" size="xxl" stroke="regular" />
        </SmartLink>
      </div>
    </Section>
  );
}
