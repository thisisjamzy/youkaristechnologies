"use client";

import { useId, type ReactNode } from "react";
import type { SpaceStep } from "@/styles/tokens/tokens";
import { cn, spaceKey } from "@/shared/lib";
import { Checkbox, type CheckboxProps } from "../Checkbox";
import styles from "./CheckboxGroup.module.scss";

export type CheckboxOption = { value: string; label: ReactNode };

export type CheckboxGroupProps = {
  legend: string;
  name: string;
  options: readonly CheckboxOption[];
  /** Ticked values. The group is controlled: pass `onChange` to update them. */
  value: readonly string[];
  onChange: (value: string[]) => void;
  error?: string;
  /** Smallest column on the 4px scale: 47.5 (190px) or 52.5 (210px). */
  min?: SpaceStep;
  gap?: SpaceStep;
  disabled?: boolean;
  checkbox?: Pick<CheckboxProps, "align" | "size" | "weight">;
  className?: string;
};

/** A `<fieldset>` of checkboxes with a `<legend>`. */
export function CheckboxGroup({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  min = 47.5,
  gap = 3,
  disabled,
  checkbox = { align: "center" },
  className,
}: CheckboxGroupProps) {
  const errorId = `${useId()}-error`;
  const toggle = (option: string, checked: boolean) =>
    onChange(checked ? [...value, option] : value.filter((v) => v !== option));

  return (
    <fieldset
      className={cn(styles.group, className)}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={cn(styles.options, styles[`min-${spaceKey(min)}`], styles[`gap-${spaceKey(gap)}`])}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={(e) => toggle(option.value, e.target.checked)}
            {...checkbox}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
