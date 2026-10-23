import type { FontSizeName, LetterSpacingName, LineHeightName, MeasureName } from "@/styles/tokens/tokens";
import type { RichLine } from "@/shared/types";
import { cn, tokenKey } from "@/shared/lib";
import styles from "./Heading.module.scss";

/**
 * How the second part of a two-part line looks:
 * `muted` (two-tone headline), `blue`, `highlight` (lime, as in "Not another prayer group.")
 * or `badge` (tighter lime pill, as in "Yours.").
 */
export type SecondTone = "muted" | "blue" | "highlight" | "badge";

export type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "b";
  /** A string, `{ main, muted }` or `{ main, emphasis }` from strings.ts. */
  text: RichLine;
  size?: FontSizeName;
  leading?: LineHeightName;
  tracking?: LetterSpacingName;
  secondTone?: SecondTone;
  /** Put the second part on its own line. */
  breakBefore?: boolean;
  tone?: "primary" | "muted" | "lime" | "blue" | "inherit";
  measure?: MeasureName;
  align?: "start" | "center";
  id?: string;
  className?: string;
};

const SPACE = " ";

/**
 * Nohemi Bold display text. Headlines are sentence case and two-tone.
 * `<Heading as="h1" size="displayXl" tracking="tightPlus" text={strings.home.opening.headline} />`
 */
export function Heading({
  as: Tag = "h2",
  text,
  size = "headingL",
  leading = "1",
  tracking = "tight",
  secondTone = "muted",
  breakBefore,
  tone = "primary",
  measure,
  align,
  id,
  className,
}: HeadingProps) {
  const [main, second] =
    typeof text === "string" ? [text] : "muted" in text ? [text.main, text.muted] : [text.main, text.emphasis];

  return (
    <Tag
      id={id}
      className={cn(
        styles.heading,
        styles[`size-${tokenKey(size)}`],
        styles[`leading-${leading}`],
        styles[`tracking-${tokenKey(tracking)}`],
        styles[`tone-${tone}`],
        measure && styles[`measure-${measure}`],
        align === "center" && styles.center,
        className,
      )}
    >
      {main}
      {second !== undefined && (
        <>
          {breakBefore ? <br /> : SPACE}
          <span className={styles[secondTone]}>{second}</span>
        </>
      )}
    </Tag>
  );
}
