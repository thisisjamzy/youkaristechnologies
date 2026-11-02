import type { FontSizeName, LetterSpacingName, LineHeightName, MeasureName } from "@/styles/tokens/tokens";
import type { RichLine } from "@/shared/types";
import { cn, tokenKey } from "@/shared/lib";
import styles from "./Heading.module.scss";

/**
 * How the second part of a two-part line looks:
 * `accent` (two-tone headline, Elite Blue), `muted` (grey, only on ink), `blue`, `highlight` (lime, as in "Not another prayer group."),
 * `highlightSoft` (the same with a softer corner, Our Story chapter 02)
 * or `badge` (tighter lime pill, as in "Yours.").
 */
export type SecondTone = "accent" | "muted" | "blue" | "highlight" | "highlightSoft" | "badge";

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
  /** A smaller size for the second part (with its own line height). */
  secondSize?: FontSizeName;
  tone?: "primary" | "accent" | "muted" | "lime" | "blue" | "inherit";
  measure?: MeasureName;
  align?: "start" | "center";
  id?: string;
  /** Lets a script move focus here (tabIndex -1), e.g. a form heading after a jump link. */
  focusable?: boolean;
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
  secondTone = "accent",
  breakBefore,
  secondSize,
  tone = "primary",
  measure,
  align,
  id,
  focusable,
  className,
}: HeadingProps) {
  const [main, second] =
    typeof text === "string" ? [text] : "muted" in text ? [text.main, text.muted] : [text.main, text.emphasis];

  return (
    <Tag
      id={id}
      tabIndex={focusable ? -1 : undefined}
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
          <span
            className={cn(
              styles[secondTone],
              secondSize && styles[`size-${tokenKey(secondSize)}`],
              secondSize && styles.secondLine,
            )}
          >
            {second}
          </span>
        </>
      )}
    </Tag>
  );
}
