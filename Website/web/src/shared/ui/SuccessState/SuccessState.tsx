import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Icon } from "../Icon";
import styles from "./SuccessState.module.scss";

export type SuccessStateProps = {
  title: string;
  /** `lime` circle on the grey Home panel, `ink` circle on the lime Build With Us panel. */
  tone?: "lime" | "ink";
  /** Body text, the "Pass it on." line and the actions. */
  children: ReactNode;
  /** Lets the form move focus to the title when it appears. */
  titleId?: string;
  className?: string;
};

/** What a form turns into once it is sent. The title is focusable so the form can move focus to it. */
export function SuccessState({ title, tone = "lime", children, titleId, className }: SuccessStateProps) {
  return (
    <div className={cn(styles.success, styles[tone], className)} role="status">
      <span className={styles.circle}>
        <Icon name="check" size="xl" stroke="heavy" />
      </span>
      <h3 id={titleId} className={styles.title} tabIndex={-1}>
        {title}
      </h3>
      {children}
    </div>
  );
}
