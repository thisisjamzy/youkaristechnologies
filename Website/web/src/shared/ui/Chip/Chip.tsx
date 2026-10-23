import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Chip.module.scss";

export type ChipProps = {
  tone?: "white" | "ink";
  /** `md` (600 weight) for the challenge chips, `sm` (700) for Sunday/Monday. */
  size?: "sm" | "md";
  /** A leading icon in a blue circle, as in "Every gift here was worked for". */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Small Barlow pill that floats on photos. `<Chip>{chip}</Chip>` */
export function Chip({ tone = "white", size = "md", icon, className, children }: ChipProps) {
  return (
    <span className={cn(styles.chip, styles[tone], styles[size], icon !== undefined && styles.withIcon, className)}>
      {icon !== undefined && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
