import { cn } from "@/shared/lib";
import { ArrowIcon } from "../ArrowIcon";
import styles from "./NumberedList.module.scss";

export type NumberedItem = { readonly n: string; readonly title: string; readonly text: string };

export type NumberedListProps = {
  items: readonly NumberedItem[];
  /**
   * `rule`: numbers over a hairline (Home reasons, Pray steps).
   * `joined`: white cards with a blue number circle joined by a line (Give).
   */
  variant?: "rule" | "joined";
  /** `display`: Nohemi 22px titles (Home). `body`: Barlow 700 18px (Pray, Give). */
  titleStyle?: "display" | "body";
  /** Hairline colour for `rule`: `mist` (Home) or `hairline` (Pray). */
  rule?: "mist" | "hairline";
  /** Draws the last rule in ink (Pray: "The chain keeps moving."). */
  emphasizeLast?: boolean;
  className?: string;
};

/** Ordered steps or reasons in an auto-fit grid. */
export function NumberedList({
  items,
  variant = "rule",
  titleStyle = "body",
  rule = "hairline",
  emphasizeLast,
  className,
}: NumberedListProps) {
  return (
    <ol className={cn(styles.list, styles[variant], styles[`rule-${rule}`], className)}>
      {items.map((item, i) => (
        <li
          key={item.n}
          className={cn(styles.item, emphasizeLast && i === items.length - 1 && styles.emphasized)}
        >
          {variant === "joined" ? (
            <span className={styles.track} aria-hidden="true">
              <span className={styles.circle}>{item.n}</span>
              <span className={styles.line} />
              <ArrowIcon direction="chevron" size="xs" stroke="heavy" className={styles.chevron} />
            </span>
          ) : (
            <span className={styles.number}>{item.n}</span>
          )}
          <b className={cn(styles.title, styles[`title-${titleStyle}`])}>{item.title}</b>
          <span className={styles.text}>{item.text}</span>
        </li>
      ))}
    </ol>
  );
}
