import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import styles from "./FormField.module.scss";

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  label: string;
  /** A lighter note after the label, e.g. "(optional)". */
  labelHint?: string;
  name: string;
  /** Message from strings.common.errors, shown under the field. */
  error?: string;
  /** `line`: underlined (Home). `box`: white rounded box (the Roles application). */
  variant?: "line" | "box";
  className?: string;
};

/** A text input with its label and error. `<FormField label={f.email.label} name="email" type="email" />` */
export function FormField({ label, labelHint, name, error, variant = "line", className, ...input }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {labelHint && <span className={styles.labelHint}> {labelHint}</span>}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(styles.input, styles[variant])}
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
