import type { ReactNode } from "react";
import type { SpaceStep } from "@/styles/tokens/tokens";
import { cn, spaceKey } from "@/shared/lib";
import styles from "./Grid.module.scss";

export type GridProps = {
  as?: "div" | "ul" | "ol";
  /**
   * Smallest column width on the 4px scale (75 = 300px). Columns fill the row and
   * wrap, so cards stack in reading order on phones.
   */
  min: SpaceStep;
  gap?: SpaceStep;
  rowGap?: SpaceStep;
  columnGap?: SpaceStep;
  className?: string;
  children: ReactNode;
};

/** Auto-fit card grid. `<Grid min={75} gap={4}>` */
export function Grid({ as: Tag = "div", min, gap = 0, rowGap, columnGap, className, children }: GridProps) {
  return (
    <Tag
      className={cn(
        styles.grid,
        styles[`min-${spaceKey(min)}`],
        styles[`row-${spaceKey(rowGap ?? gap)}`],
        styles[`col-${spaceKey(columnGap ?? gap)}`],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
