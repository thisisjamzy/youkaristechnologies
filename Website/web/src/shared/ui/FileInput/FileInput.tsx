"use client";

import { useId, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import fieldStyles from "../FormField/FormField.module.scss";
import { Icon } from "../Icon";
import styles from "./FileInput.module.scss";

export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id" | "type"> & {
  label: string;
  name: string;
  /** Button text before a file is chosen, and after ("Upload your CV" / "Change file"). */
  buttonLabel: string;
  changeLabel: string;
  /** Shown in place of the file name before one is chosen. */
  emptyLabel: string;
  /** Under the box, e.g. "PDF or Word document". */
  hint?: string;
  error?: string;
  className?: string;
};

/**
 * A file picker in the white box style. The real `<input type="file">` stays in the page,
 * visually hidden but focusable, and the whole box is its label, so the keyboard, screen
 * readers and native validation all keep working.
 */
export function FileInput({
  label,
  name,
  buttonLabel,
  changeLabel,
  emptyLabel,
  hint,
  error,
  className,
  onChange,
  ...input
}: FileInputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [fileName, setFileName] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.files?.[0]?.name ?? "");
    onChange?.(event);
  };

  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn(fieldStyles.field, className)}>
      <span className={fieldStyles.label} id={`${id}-label`}>
        {label}
      </span>
      <label htmlFor={id} className={cn(styles.box, error && styles.invalid)}>
        <input
          id={id}
          name={name}
          type="file"
          aria-labelledby={`${id}-label ${id}-name`}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={styles.input}
          onChange={handleChange}
          {...input}
        />
        <span className={styles.button} aria-hidden="true">
          <span className={styles.icon}>
            <Icon name="upload" size="sm" stroke="heavy" />
          </span>
          {fileName ? changeLabel : buttonLabel}
        </span>
        <span id={`${id}-name`} className={cn(styles.name, !fileName && styles.empty)}>
          {fileName || emptyLabel}
        </span>
      </label>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <p id={errorId} className={fieldStyles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
