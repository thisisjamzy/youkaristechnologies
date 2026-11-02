import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Heading, Icon, IconBox, type IconName } from "@/shared/ui";
import styles from "./JoinPanel.module.scss";

export type JoinPanelPoint = { icon: IconName; title: string; text?: string };

export type JoinPanelProps = {
  headline: string;
  body: string;
  points: readonly JoinPanelPoint[];
  /** The form (join-network). */
  children: ReactNode;
  className?: string;
};

/** Home's white card: the pitch and its points on the left, the grey form panel on the right. */
export function JoinPanel({ headline, body, points, children, className }: JoinPanelProps) {
  return (
    <div className={cn(styles.panel, className)}>
      <div className={styles.intro}>
        <Heading text={headline} size="fluid-34-52" leading="1-02" />
        <p className={styles.body}>{body}</p>
        <ul className={styles.points}>
          {points.map((point) => (
            <li key={point.title} className={styles.point}>
              <IconBox>
                <Icon name={point.icon} />
              </IconBox>
              {point.text ? (
                <span>
                  <b className={styles.pointTitle}>{point.title}</b>
                  <span className={styles.pointText}>{point.text}</span>
                </span>
              ) : (
                <b className={styles.pointTitle}>{point.title}</b>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.form}>{children}</div>
    </div>
  );
}
