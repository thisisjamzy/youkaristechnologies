import { strings } from "@/content/strings";
import { cn } from "@/shared/lib";
import { Counter } from "@/shared/ui";
import styles from "./PlacesBadge.module.scss";

export type PlacesBadgeProps = {
  /**
   * Core team places left, from the backend (wired in phase 8). `null` when unknown:
   * the badge then renders nothing rather than a guess.
   */
  left: number | null;
  /** `ink` on light and lime grounds, `white` on photos. */
  tone?: "ink" | "white";
  className?: string;
};

/** "17 of 20 places still open", or the core-team-complete line when none are left. */
export function PlacesBadge({ left, tone = "ink", className }: PlacesBadgeProps) {
  if (left === null) return null;
  if (left <= 0) {
    return <span className={cn(styles.complete, styles[tone], className)}>{strings.common.places.complete}</span>;
  }
  return <Counter value={left} caption={strings.common.places.ofTotal} tone={tone} className={className} />;
}
