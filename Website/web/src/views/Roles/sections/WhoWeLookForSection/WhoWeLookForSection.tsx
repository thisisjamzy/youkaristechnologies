import { strings } from "@/content/strings";
import { cn } from "@/shared/lib";
import { Heading, Label, Section } from "@/shared/ui";
import styles from "./WhoWeLookForSection.module.scss";

const { whoWeLookFor } = strings.roles;

// Two white cards and one ink card, as designed.
const INK_CARD = 2;

export function WhoWeLookForSection() {
  return (
    <Section top="section">
      <Heading text={whoWeLookFor.headline} size="headingL" leading="1-02" measure="900" className={styles.heading} />
      <div className={styles.grid}>
        {whoWeLookFor.cards.map((card, i) => (
          <div key={card.title} className={cn(styles.card, i === INK_CARD && styles.ink)}>
            <Label tone={i === INK_CARD ? "inherit" : "blue"} className={styles.label}>
              {card.label}
            </Label>
            <Heading as="h3" text={card.title} size="24" leading="1-1" tracking="snug" tone="inherit" />
            <span className={styles.text}>{card.text}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
