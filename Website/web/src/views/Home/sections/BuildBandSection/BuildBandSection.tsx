import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowIcon, Heading, Section, SmartLink } from "@/shared/ui";
import styles from "./BuildBandSection.module.scss";

const { buildBand } = strings.home;

/** The one large lime element on its screen: the call to volunteer. */
export function BuildBandSection() {
  return (
    <Section top="sectionLarge">
      <div className={styles.band}>
        <Heading text={buildBand.headline} size="fluid-34-56" leading="1-02" className={styles.headline} />
        <div className={styles.aside}>
          <p className={styles.body}>{buildBand.body}</p>
          <SmartLink href={routes.roles} className={styles.rolesLink}>
            {buildBand.rolesLink}
          </SmartLink>
        </div>
        <SmartLink href={routes.volunteer} aria-label={buildBand.linkAria} className={styles.link}>
          <ArrowIcon direction="upRight" size="xxl" stroke="regular" />
        </SmartLink>
      </div>
    </Section>
  );
}
