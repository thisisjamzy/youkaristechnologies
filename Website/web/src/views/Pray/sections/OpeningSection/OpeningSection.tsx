import { strings } from "@/content/strings";
import { FrostedCard, Label, OpeningIntro, Overlay, PhotoWithOverlay, Section, Tag } from "@/shared/ui";
import styles from "./OpeningSection.module.scss";

const copy = strings.pray.opening;
// Three of five decades prayed.
const decades = [true, true, true, false, false];

export function OpeningSection() {
  return (
    <Section top="opening">
      <OpeningIntro tag={<Tag variant="lime">{copy.label}</Tag>} headline={copy.headline} lead={copy.body}>
        <PhotoWithOverlay name="prayHandsRaised" alt={copy.photoAlt} height="feature" priority>
          <Overlay position="bottomLeft" className={styles.cardSlot}>
            <FrostedCard direction="column" className={styles.card}>
              <Label size="13">{copy.appCard.label}</Label>
              <span className={styles.progressLabel}>{copy.appCard.progress}</span>
              <span className={styles.bars} aria-hidden="true">
                {decades.map((done, i) => (
                  <span key={i} className={done ? styles.done : styles.todo} />
                ))}
              </span>
            </FrostedCard>
          </Overlay>
        </PhotoWithOverlay>
      </OpeningIntro>
    </Section>
  );
}
