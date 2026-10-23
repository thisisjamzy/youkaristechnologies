import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { ArrowLink, Heading, Overlay, PhotoWithOverlay, PullLine, Section, Tag, Text } from "@/shared/ui";
import styles from "./GatherSection.module.scss";

const { gather } = strings.home;

export function GatherSection() {
  return (
    <Section top="fluid-80-128" id="gather">
      <PhotoWithOverlay name="gatherCrowd" alt={gather.photoAlt} height="wide">
        <Overlay position="topLeft">
          <Tag variant="lime" size="lg">
            {gather.label}
          </Tag>
        </Overlay>
        <Overlay position="bottomRight" stackOnMobile className={styles.cardSlot}>
          <div className={styles.card}>
            <Heading text={gather.headline} size="44" />
            <Text>{gather.body}</Text>
            <ArrowLink href={routes.gather}>{gather.link}</ArrowLink>
          </div>
        </Overlay>
      </PhotoWithOverlay>
      <PullLine text={gather.closing} className={styles.closing} />
    </Section>
  );
}
