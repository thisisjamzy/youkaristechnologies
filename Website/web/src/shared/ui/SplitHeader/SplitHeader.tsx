import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Text } from "../Text";
import styles from "./SplitHeader.module.scss";

export type SplitHeaderProps = {
  /** The heading side: usually a Tag and a Heading. */
  children: ReactNode;
  /** Short text on the right, max 380px. */
  aside?: string;
  className?: string;
};

/**
 * Heading on the left, a short line of text on the right, bottoms aligned.
 * Wraps to one column on phones.
 */
export function SplitHeader({ children, aside, className }: SplitHeaderProps) {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.main}>{children}</div>
      {aside && (
        <Text size="17" measure="380" className={styles.aside}>
          {aside}
        </Text>
      )}
    </div>
  );
}
