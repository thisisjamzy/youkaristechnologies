import type { ReactNode } from "react";
import type { FontSizeName, LineHeightName, MeasureName } from "@/styles/tokens/tokens";
import { cn, tokenKey } from "@/shared/lib";
import styles from "./Text.module.scss";

export type TextProps = {
  as?: "p" | "span" | "div" | "li" | "b" | "strong";
  /**
   * Presets from the reference: `lead` 18/1.55, `body` 16/1.6, `small` 14/1.5, `longform` 19/1.75.
   * `size` and `leading` override the preset.
   */
  variant?: "lead" | "body" | "small" | "longform";
  size?: FontSizeName;
  leading?: LineHeightName;
  /** `body` is the grey body colour on light grounds; `longform` the Our Story reading colour. */
  tone?: "body" | "primary" | "longform" | "muted" | "onDarkMuted" | "inherit";
  weight?: "regular" | "medium" | "semibold" | "bold";
  measure?: MeasureName;
  align?: "start" | "center";
  className?: string;
  children: ReactNode;
};

const presets = {
  lead: { size: "18", leading: "1-55", tone: "body" },
  body: { size: "16", leading: "1-6", tone: "body" },
  small: { size: "14", leading: "1-5", tone: "body" },
  longform: { size: "19", leading: "1-75", tone: "longform" },
} as const;

/** Barlow body copy. `<Text variant="lead" size="19" leading="1-65">...</Text>` */
export function Text({
  as: Tag = "p",
  variant = "body",
  size,
  leading,
  tone,
  weight = "regular",
  measure,
  align,
  className,
  children,
}: TextProps) {
  const preset = presets[variant];
  return (
    <Tag
      className={cn(
        styles.text,
        styles[`size-${tokenKey(size ?? preset.size)}`],
        styles[`leading-${leading ?? preset.leading}`],
        styles[`tone-${tokenKey(tone ?? preset.tone)}`],
        styles[`weight-${weight}`],
        measure && styles[`measure-${measure}`],
        align === "center" && styles.center,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
