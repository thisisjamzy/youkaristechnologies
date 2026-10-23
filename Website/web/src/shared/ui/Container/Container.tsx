import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Container.module.scss";

export type ContainerProps = {
  as?: "div" | "section" | "article" | "header" | "footer" | "nav" | "main";
  /** `default` is the 1200px page width; `reading` is the 688px long-form column. */
  width?: "default" | "reading";
  className?: string;
  id?: string;
  children: ReactNode;
};

/** Centres content at the page width with the side gutter. `<Container width="reading">` */
export function Container({ as: Tag = "div", width = "default", className, id, children }: ContainerProps) {
  return (
    <Tag id={id} className={cn(styles.container, width === "reading" && styles.reading, className)}>
      {children}
    </Tag>
  );
}
