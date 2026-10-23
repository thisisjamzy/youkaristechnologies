import type { ReactNode } from "react";
import type { TwoTone } from "@/shared/types";
import { Heading } from "../Heading";
import { Text } from "../Text";
import styles from "./OpeningIntro.module.scss";

export type OpeningIntroProps = {
  /** The page tag (lime, ink or blue pill). */
  tag: ReactNode;
  headline: string | TwoTone;
  lead: string;
  /** The opening photo, placed below with the reference's top spacing. */
  children?: ReactNode;
};

/**
 * The opening of Pray, Give and Gather: tag and h1 on the left, the lead on the right,
 * bottoms aligned, then the photo.
 */
export function OpeningIntro({ tag, headline, lead, children }: OpeningIntroProps) {
  return (
    <>
      <div className={styles.intro}>
        <div className={styles.headline}>
          {tag}
          <Heading as="h1" text={headline} size="displayXl" tracking="tightPlus" />
        </div>
        <Text variant="lead" leading="1-6" className={styles.lead}>
          {lead}
        </Text>
      </div>
      {children && <div className={styles.photo}>{children}</div>}
    </>
  );
}
