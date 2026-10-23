import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { SmartLink } from "../SmartLink";
import styles from "./FolderCard.module.scss";

export type FolderCardProps = {
  tone?: "lime" | "white" | "ink";
  /** Tab width: `narrow` 40% (path switcher), `mid` 44% (teams), `wide` 46% (lime cards). */
  tab?: "narrow" | "mid" | "wide";
  /** Tab height: `md` 20px, `lg` 22px. */
  tabHeight?: "md" | "lg";
  /** Corner radius of the card body: `lg` 20px, `xl` 24px. */
  radius?: "lg" | "xl";
  /** Makes the whole card one link. */
  href?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

/**
 * The signature folder-tab card: a short tab on the top-left edge.
 * `<FolderCard tone="lime" tab="wide">...</FolderCard>`
 */
export function FolderCard({
  tone = "white",
  tab = "narrow",
  tabHeight = "md",
  radius = "xl",
  href,
  className,
  bodyClassName,
  children,
}: FolderCardProps) {
  const inner = (
    <>
      <div className={cn(styles.tab, styles[`tab-${tab}`], styles[`tabHeight-${tabHeight}`])} aria-hidden="true" />
      <div className={cn(styles.body, styles[`radius-${radius}`], bodyClassName)}>{children}</div>
    </>
  );
  const classes = cn(styles.card, styles[tone], href !== undefined && styles.link, className);

  return href !== undefined ? (
    <SmartLink href={href} className={classes}>
      {inner}
    </SmartLink>
  ) : (
    <div className={classes}>{inner}</div>
  );
}
