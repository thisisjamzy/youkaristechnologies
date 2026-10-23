import type { ReactNode } from "react";
import type { SpaceStep } from "@/styles/tokens/tokens";
import { cn, spaceKey } from "@/shared/lib";
import styles from "./Stack.module.scss";

export type StackProps = {
  as?: "div" | "ul" | "ol" | "li" | "span" | "header";
  direction?: "column" | "row";
  /** Gap on the 4px scale (6 = 24px). `rowGap`/`columnGap` override it per axis. */
  gap?: SpaceStep;
  rowGap?: SpaceStep;
  columnGap?: SpaceStep;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  className?: string;
  children: ReactNode;
};

/** Flex column or row with a token gap. `<Stack gap={4} align="start">` */
export function Stack({
  as: Tag = "div",
  direction = "column",
  gap = 0,
  rowGap,
  columnGap,
  align,
  justify,
  wrap,
  className,
  children,
}: StackProps) {
  return (
    <Tag
      className={cn(
        styles.stack,
        styles[direction],
        styles[`row-${spaceKey(rowGap ?? gap)}`],
        styles[`col-${spaceKey(columnGap ?? gap)}`],
        align && styles[`align-${align}`],
        justify && styles[`justify-${justify}`],
        wrap && styles.wrap,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
