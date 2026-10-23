import { cn } from "@/shared/lib";
import styles from "./Accordion.module.scss";

export type AccordionItem = { readonly question: string; readonly answer: string };

export type AccordionProps = {
  items: readonly AccordionItem[];
  className?: string;
};

/**
 * FAQ built on `<details>`, so it works without JavaScript and stays a Server Component.
 * The "+" is decorative.
 */
export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn(styles.accordion, className)}>
      {items.map((item) => (
        <details key={item.question} className={styles.item}>
          <summary className={styles.question}>
            {item.question}
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
