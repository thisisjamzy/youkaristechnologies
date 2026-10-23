import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/shared/lib";
import { ArrowIcon, type ArrowDirection } from "../ArrowIcon";
import { SmartLink } from "../SmartLink";
import styles from "./Button.module.scss";

type Common = {
  /**
   * `primary`: lime pill. `outline`: ink border on a clear ground. `light`: white with an ink border.
   * `dark`: ink pill. `ghost`: for ink grounds (white text, grey border).
   */
  variant?: "primary" | "outline" | "light" | "dark" | "ghost";
  /** Adds the arrow circle. Ink circle on primary, lime circle on the others. */
  arrow?: ArrowDirection;
  /** Full-width form button with a 14px radius. */
  block?: boolean;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string };
type AsButton = Common & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export type ButtonProps = AsLink | AsButton;

/**
 * Pill button, rendered as a link when given `href`, otherwise as a `<button>`.
 * `<Button href="#join" arrow="right">{strings.home.opening.primaryCta}</Button>`
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", arrow, block, className, children } = props;
  const classes = cn(
    styles.button,
    styles[variant],
    arrow ? styles[variant === "primary" ? "withArrow" : "withArrowSm"] : styles.plain,
    block && styles.block,
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <span className={styles.circle}>
          <ArrowIcon direction={arrow} size="md" />
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    return (
      <SmartLink href={props.href} className={classes} aria-label={props["aria-label"]}>
        {content}
      </SmartLink>
    );
  }
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props["aria-label"]}
      className={classes}
    >
      {content}
    </button>
  );
}
