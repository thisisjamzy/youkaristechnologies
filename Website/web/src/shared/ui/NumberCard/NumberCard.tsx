import { cn } from "@/shared/lib";
import styles from "./NumberCard.module.scss";

export type NumberCardProps = {
  label: string;
  value: string;
  caption: string;
  tone?: "white" | "lime";
  /** `md`: 88px number (Our Story). `lg`: 104px number (Home). */
  size?: "md" | "lg";
  className?: string;
};

/** Big number with a label and caption. `<NumberCard tone="lime" size="lg" {...strings.home.pray.numberCard} />` */
export function NumberCard({ label, value, caption, tone = "white", size = "md", className }: NumberCardProps) {
  return (
    <div className={cn(styles.card, styles[tone], styles[size], className)}>
      <span className={styles.label}>{label}</span>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.caption}>{caption}</p>
      </div>
    </div>
  );
}
