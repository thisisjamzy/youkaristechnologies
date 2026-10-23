import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./IconBox.module.scss";

export type IconBoxProps = {
  /** `md` 40px (list items), `lg` 44px (footer social links). */
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

/** Hairline rounded square holding a line icon. */
export function IconBox({ size = "md", className, children }: IconBoxProps) {
  return <span className={cn(styles.box, styles[size], className)}>{children}</span>;
}
