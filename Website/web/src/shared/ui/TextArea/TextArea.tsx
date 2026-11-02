import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import styles from "../FormField/FormField.module.scss";
import own from "./TextArea.module.scss";

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "id"> & {
  label: string;
  name: string;
  error?: string;
  /** `line`: underlined. `box`: white rounded box (the Roles application). */
  variant?: "line" | "box";
  /** Small text under the field, e.g. a character count. Linked to the field for screen readers. */
  note?: ReactNode;
  className?: string;
};

/** Multi-line field, styled like FormField. */
export function TextArea({ label, name, error, variant = "line", note, rows = 3, className, ...textarea }: TextAreaProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;
  const describedBy = [error && errorId, note && noteId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(styles.input, styles[variant], own.textarea)}
        {...textarea}
      />
      {note && (
        <p id={noteId} className={own.note}>
          {note}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
