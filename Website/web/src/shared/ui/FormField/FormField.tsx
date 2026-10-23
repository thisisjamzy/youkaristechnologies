import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import styles from "./FormField.module.scss";

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  label: string;
  name: string;
  /** Message from strings.common.errors, shown under the field. */
  error?: string;
  /** `onLime` draws the underline in ink, for the Build With Us panel. */
  tone?: "default" | "onLime";
  className?: string;
};

/** Underlined text input with its label and error. `<FormField label={f.email.label} name="email" type="email" />` */
export function FormField({ label, name, error, tone = "default", className, ...input }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(styles.input, styles[tone])}
        {...input}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
