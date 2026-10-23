import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Label.module.scss";

export type LabelProps = {
  as?: "span" | "p" | "div";
  /** 14px by default; 13px for small app labels, 15px on photos. */
  size?: "13" | "14" | "15";
  tone?: "body" | "primary" | "blue" | "onDarkMuted" | "inherit";
  className?: string;
  children: ReactNode;
};

/** Barlow Condensed uppercase eyebrow, 1.5px tracking. `<Label>{strings.home.challenge.label}</Label>` */
export function Label({ as: Tag = "span", size = "14", tone = "body", className, children }: LabelProps) {
  return <Tag className={cn(styles.label, styles[`size-${size}`], styles[`tone-${tone}`], className)}>{children}</Tag>;
}
