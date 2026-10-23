"use client";

import type { Ref } from "react";
import { cn } from "@/shared/lib";
import styles from "./MenuButton.module.scss";

export type MenuButtonProps = {
  /** Draws the X (the close button inside the open menu). */
  open: boolean;
  label: string;
  controls: string;
  onClick: () => void;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
};

/** The 44px menu button: three ink lines that turn into an X. */
export function MenuButton({ open, label, controls, onClick, ref, className }: MenuButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(styles.button, open && styles.open, className)}
      aria-label={label}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className={styles.lines} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
