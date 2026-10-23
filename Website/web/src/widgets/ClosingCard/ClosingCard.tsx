import Image from "next/image";
import { strings } from "@/content/strings";
import { CopyLinkButton, WhatsAppShareLink } from "@/features/share-network";
import styles from "./ClosingCard.module.scss";

const { closingCard, share, site } = strings.common;

/**
 * "Now pass it on." The one ink card on every page, and the only place the brand
 * pattern appears: the lime swatch across the whole card at 10%.
 */
export function ClosingCard() {
  return (
    <section className={styles.band} aria-label={closingCard.headline}>
      <div className={styles.card}>
        <Image
          src="/brand/pattern/sfm-pattern-swatch-lime.svg"
          alt=""
          aria-hidden="true"
          fill
          className={styles.pattern}
        />
        <div className={styles.lead}>
          <p className={styles.statement}>{closingCard.lead}</p>
          <p className={`${styles.statement} ${styles.muted}`}>{closingCard.whatWeDo}</p>
        </div>
        <div className={styles.action}>
          <p className={styles.headline}>{closingCard.headline}</p>
          <div className={styles.buttons}>
            <WhatsAppShareLink message={share.fromClosingCard} label={closingCard.whatsApp} />
            <CopyLinkButton url={site.url} label={closingCard.copyLink} copiedLabel={closingCard.linkCopied} />
          </div>
        </div>
      </div>
    </section>
  );
}
