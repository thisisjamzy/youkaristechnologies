import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Checkbox.module.scss";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className" | "children" | "size"> & {
  /** The label: text, or `<b>Join as a stranger.</b> Invite me in...` */
  children: ReactNode;
  /** `start` for multi-line labels, `center` for one-line team names. */
  align?: "start" | "center";
  size?: "15" | "16";
  weight?: "regular" | "medium";
  className?: string;
};

/** Native checkbox (20px, ink accent) with its label. */
export function Checkbox({ children, align = "start", size = "16", weight = "regular", className, ...input }: CheckboxProps) {
  return (
    <label className={cn(styles.checkbox, styles[align], styles[`size-${size}`], styles[weight], className)}>
      <input type="checkbox" className={styles.input} {...input} />
      <span>{children}</span>
    </label>
  );
}
