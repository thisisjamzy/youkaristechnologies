import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import fieldStyles from "../FormField/FormField.module.scss";
import { Icon } from "../Icon";
import styles from "./Select.module.scss";

export type SelectOption = { value: string; label: string };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "id" | "children"> & {
  label: string;
  name: string;
  options: readonly SelectOption[];
  /** The empty first option, e.g. "Choose a role". */
  placeholder: string;
  error?: string;
  className?: string;
};

/**
 * A native select in the white box style, with the lime chevron circle in place of the
 * browser's arrow. Native, so keyboard, screen readers and phone pickers all work.
 */
export function Select({ label, name, options, placeholder, error, className, ...select }: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn(fieldStyles.field, className)}>
      <label htmlFor={id} className={fieldStyles.label}>
        {label}
      </label>
      <span className={styles.wrap}>
        <select
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(fieldStyles.input, fieldStyles.box, styles.select)}
          {...select}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.indicator} aria-hidden="true">
          <Icon name="chevronDown" size="xs" stroke="heavier" />
        </span>
      </span>
      {error && (
        <p id={errorId} className={fieldStyles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
