import type { ReactNode } from "react";
import { Label, Section } from "@/shared/ui";
import styles from "./StoryChapter.module.scss";

export type StoryChapterProps = {
  /** Position in the story, from 1; shown as "01". */
  index: number;
  label: string;
  /** The heading, text and media of the chapter. */
  children: ReactNode;
};

/**
 * A numbered chapter of Our Story: a hairline, then the number and label in a narrow column
 * beside the content on wide screens. Below 1024px they stack.
 */
export function StoryChapter({ index, label, children }: StoryChapterProps) {
  return (
    <Section top="fluid-72-120">
      <div className={styles.chapter}>
        <div className={styles.aside}>
          <span className={styles.number} aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
          <Label>{label}</Label>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Section>
  );
}
