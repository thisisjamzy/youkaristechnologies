import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import styles from "../FormField/FormField.module.scss";
import own from "./TextArea.module.scss";

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "id"> & {
  label: string;
  name: string;
  error?: string;
  tone?: "default" | "onLime";
  className?: string;
};

/** Underlined multi-line field, styled like FormField. */
export function TextArea({ label, name, error, tone = "default", rows = 3, className, ...textarea }: TextAreaProps) {
  const id = useId();
  const errorId = `${id}-error`;
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
        aria-describedby={error ? errorId : undefined}
        className={cn(styles.input, styles[tone], own.textarea)}
        {...textarea}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
