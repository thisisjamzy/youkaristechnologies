import type { ReactNode } from "react";
import type { FluidSpaceName, GapStep } from "@/styles/tokens/tokens";
import { cn, spaceKey, tokenKey } from "@/shared/lib";
import styles from "./Section.module.scss";

/** A fluid rhythm token (`section`, `sectionLarge`, `opening`, ...) or a step on the 4px scale. */
export type SectionSpace = FluidSpaceName | GapStep;

export type SectionProps = {
  as?: "section" | "article" | "div";
  /** Space above. Sections are separated by space, never by colour bands. */
  top?: SectionSpace;
  bottom?: SectionSpace;
  width?: "default" | "reading";
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
};

const key = (space: SectionSpace) => (typeof space === "number" ? spaceKey(space) : tokenKey(space));

/**
 * A page section: the container plus its top and bottom space.
 * `<Section top="section" className={styles.challenge}>...</Section>`
 */
export function Section({
  as: Tag = "section",
  top = "section",
  bottom = 0,
  width = "default",
  id,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        styles.section,
        width === "reading" && styles.reading,
        styles[`top-${key(top)}`],
        styles[`bottom-${key(bottom)}`],
        className,
      )}
      {...aria}
    >
      {children}
    </Tag>
  );
}
