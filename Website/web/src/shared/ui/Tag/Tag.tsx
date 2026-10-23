import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Tag.module.scss";

export type TagProps = {
  /**
   * `dot`: white pill with a blue square dot (add `bordered` on paper grounds).
   * `lime`, `ink` (lime text) and `blue` (white text) are solid pills.
   */
  variant?: "dot" | "lime" | "ink" | "blue";
  bordered?: boolean;
  /** `lg` is the larger tag that sits on photos. */
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

/** Uppercase pill tag. `<Tag variant="dot" bordered>{label}</Tag>` */
export function Tag({ variant = "dot", bordered, size = "md", className, children }: TagProps) {
  return (
    <span className={cn(styles.tag, styles[variant], styles[size], bordered && styles.bordered, className)}>
      {variant === "dot" && <span className={styles.dotMark} aria-hidden="true" />}
      {children}
    </span>
  );
}
