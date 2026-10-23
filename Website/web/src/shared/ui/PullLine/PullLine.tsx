import type { FontSizeName, LineHeightName } from "@/styles/tokens/tokens";
import type { RichLine } from "@/shared/types";
import { Heading, type SecondTone } from "../Heading";

export type PullLineProps = {
  text: RichLine;
  /** `muted` for the grey line under a section, `primary` for an ink closing line. */
  tone?: "muted" | "primary";
  secondTone?: SecondTone;
  breakBefore?: boolean;
  size?: FontSizeName;
  leading?: LineHeightName;
  align?: "start" | "center";
  className?: string;
};

/**
 * A short Nohemi line that closes a section, e.g. "Every decade is a gift from one stranger to another."
 * `<PullLine text={strings.home.pray.photoCard} align="center" />`
 */
export function PullLine({
  text,
  tone = "muted",
  secondTone = "blue",
  breakBefore,
  size = "titleM",
  leading,
  align = "start",
  className,
}: PullLineProps) {
  return (
    <Heading
      as="p"
      text={text}
      size={size}
      leading={leading ?? "1-2"}
      tracking="snug"
      tone={tone}
      secondTone={secondTone}
      breakBefore={breakBefore}
      align={align}
      className={className}
    />
  );
}
