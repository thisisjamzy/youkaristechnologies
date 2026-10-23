import { cn } from "@/shared/lib";
import styles from "./Counter.module.scss";

export type CounterProps = {
  /** Places left. Render nothing rather than a guess when it is unknown. */
  value: number;
  /** "of 20 places still open" from strings. */
  caption: string;
  /** `ink` on light and lime grounds, `white` on photos. */
  tone?: "ink" | "white";
  className?: string;
};

// A real space for screen readers; the flex gap does the visual spacing.
const SPACE = " ";

/** The places pill: a lime number and its caption. */
export function Counter({ value, caption, tone = "ink", className }: CounterProps) {
  return (
    <span className={cn(styles.counter, styles[tone], className)}>
      <span className={styles.value}>{value}</span>
      {SPACE}
      {caption}
    </span>
  );
}
