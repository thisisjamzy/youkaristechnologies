import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./FrostedCard.module.scss";

export type FrostedCardProps = {
  /** `row` puts the mark beside the text; `column` stacks a label, value and progress. */
  direction?: "row" | "column";
  className?: string;
  children: ReactNode;
};

/** Frosted glass card that floats on photos. */
export function FrostedCard({ direction = "row", className, children }: FrostedCardProps) {
  return <div className={cn(styles.card, styles[direction], className)}>{children}</div>;
}
